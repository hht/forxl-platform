import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import _ from 'lodash'
import { AnimatePresence } from 'moti'
import { Fragment, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList } from 'react-native'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import {
    getBonusConfig, getPartnerConfig, getPartnerInfo, getReferralListByUser, ReferralList
} from '~/api/partner'
import {
    Button, Card, copyToClipboard, Dialog, Figure, Icon, Image, Justified, Moti, Popup, Row,
    Statistics, Text, XStack, YStack
} from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useForxlStore, usePartnerStore, usePromptStore, useStatementStore } from '~/hooks/useStore'
import { APP_URL } from '~/lib/constants'
import { dayjs, DEVICE_WIDTH, formatCurrency, formatDecimal, uuid } from '~/lib/utils'

import { LEVELS } from './utils/level'

const maskEmail = (email?: string) => {
    if (!email) return ""
    const [username, domain] = email.split("@")

    if (!domain) return email

    if (username.length <= 6) {
        return username.length === 1
            ? `${username}@${domain}`
            : `${username[0]}${"*".repeat(username.length - 1)}@${domain}`
    }

    const maskedPart = "*".repeat(6)
    const visiblePart = username.slice(0, -6)

    return `${visiblePart}${maskedPart}@${domain}`
}

const keyExtractor = (item: ReferralList[number]) => `${item.userId}`
const ListEmptyComponent = () => {
    const { t } = useTranslation()
    return <YStack
        gap={12}
        w={DEVICE_WIDTH - 32}
        px="$md"
        h="100%"
        ai="center"
        jc="center"
    >
        <Figure name="empty" width={90} height={90} />
        <Text col="$tertiary">{t("message.empty")}</Text>
    </YStack>
}

const useStore = createWithEqualityFn<{
    users: number[]
    currentIndex: number
    visible: boolean
    referral?: ReferralList
}>(set => ({
    users: [],
    currentIndex: 0,
    visible: false,
    referral: undefined,
}))

export const AccountInfo = () => {
    const { account } = useForxlStore()
    const { t } = useTranslation()
    const dict = t("partner", {
        returnObjects: true,
    })
    const ref = useRef<FlatList>(null)
    const currentLevel = usePartnerStore((state) => state.partnerLevel, shallow)
    const { users, currentIndex, visible, referral } = useStore()
    const userId = _.last(users)
    const { loading: refreshing } = useRequest(() => {
        return getReferralListByUser(userId)
    }, {
        refreshDeps: [userId],
        cacheKey: `${CACHE_KEY.REFERRALS}/${userId}`,
        onSuccess: (data) => {
            useStore.setState({ referral: data, currentIndex: 0 })
            try {
                ref.current?.scrollToIndex({
                    index: 0,
                    animated: false,
                })
            } catch (e) { }

        }
    })
    const { loading, data } = useRequest(getPartnerInfo, {
        cacheKey: CACHE_KEY.PARTNER,
        onSuccess: (data) => {
            usePartnerStore.setState({
                currentLevel: data?.level,
                partnerLevel: data?.level,
            })
        },
    })
    const { data: bonusConfig } = useRequest(getBonusConfig)
    useRequest(getPartnerConfig, {
        onSuccess: (data) => {
            usePartnerStore.setState({
                config: data,
            })
        },
    })
    const renderItem = useCallback(
        ({ item }: { item: ReferralList[number] }) => {
            return (<YStack
                gap={12}
                w={DEVICE_WIDTH - 32}
                px="$md"
                key={item.userId}
            >
                <Justified>
                    <XStack
                        gap="$xs"
                        ai="center"
                        hitSlop={10}
                        onPress={() => {
                            usePromptStore.setState({
                                title: "",
                                desc: t("partner.directAccountsDesc", {
                                    amount: bonusConfig?.minSourceAmount2
                                }),
                                reloadKey: uuid(),
                            })
                        }}
                    >
                        <Text col="$secondary">{t("partner.accountId")}</Text>
                        <Icon name="info" size={12} />
                    </XStack>
                    <Text>{item.userId}</Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{t("partner.accountLevel")}</Text>
                    <XStack gap="$xs">
                        <Image width={20} height={20} source={LEVELS[item.level!]}></Image>
                        <Text>{dict.children[item.level!]}</Text>
                    </XStack>
                </Justified>
                <Justified gap="$md" ai="flex-start">
                    <Text col="$secondary">{dict.accountEmail}</Text>
                    <Text f={1} ta="right" numberOfLines={1}>
                        {maskEmail(item.email)}
                    </Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{dict.CertificationName}</Text>
                    <Text>{item.certificationName || "-"}</Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{t("partner.fundsInvested")}</Text>
                    <Text>{formatCurrency(`${item.invested}`)}</Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{dict.size}</Text>
                    <Text>
                        {t("partner.personCount", { count: item.teamSize })}
                    </Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{dict.volume}</Text>
                    <Text>{formatCurrency(item.teamVolume ?? 0)}</Text>
                </Justified>
                <Justified>
                    <Text col="$secondary">{t("partner.registerDate")}</Text>
                    <Text>
                        {dayjs(item.registrationDate).format("MMM DD, YYYY")}
                    </Text>
                </Justified>
            </YStack>)
        }, [t, dict])

    if (loading) {
        return (
            <YStack f={1} ai="center" jc="center">
                <ActivityIndicator />
            </YStack>
        )
    }
    return (
        <Fragment>
            <AnimatePresence>
                {data && (
                    <Moti
                        from={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card gap="$md">
                            <XStack gap={12}>
                                <Image source={LEVELS[currentLevel]} width={48} height={50} />
                                <YStack gap="$sm">
                                    <Text col="$secondary">{dict.level}</Text>
                                    <XStack ai="center" gap="$sm">
                                        <Text subject>
                                            {_.upperCase(dict.children[currentLevel])}
                                        </Text>
                                        <XStack
                                            hitSlop={10}
                                            onPress={() =>
                                                Linking.openURL(
                                                    `${APP_URL}/partnership/become-a-partner`
                                                )
                                            }
                                        >
                                            <Icon name="info" size={16} />
                                        </XStack>
                                    </XStack>
                                </YStack>
                            </XStack>
                            <Justified>
                                <Statistics label={t("referral.accounts")}>
                                    <Row gap="$sm">
                                        <Text heading bold>
                                            {`${data?.activeDirectNum ?? 0}/${data?.allDirectNum ?? 0}`}
                                        </Text>
                                        <XStack hitSlop={10} onPress={() => useStore.setState({ visible: true })}>
                                            <Icon name="info" size={16} />
                                        </XStack>
                                    </Row>
                                </Statistics>
                                <Statistics label={t("partner.earnBonuses")} jc="flex-end">
                                    <Button
                                        h={24}
                                        onPress={() => {
                                            copyToClipboard(
                                                `${APP_URL}/?code=${account?.inviteCode}`
                                            )
                                        }}
                                    >
                                        <Text bold col="$background">
                                            {t("action.share")}
                                        </Text>
                                    </Button>
                                </Statistics>
                            </Justified>
                            <Justified>
                                <Statistics label={dict.size}>
                                    <Text bold>
                                        {t("partner.personCount", { count: data?.teamSize })}
                                    </Text>
                                </Statistics>
                                <Statistics label={dict.volume} ai="flex-end">
                                    <Text>{formatCurrency(data?.teamVolume ?? 0)}</Text>
                                </Statistics>
                            </Justified>
                            <Justified>
                                <Statistics label={t("referral.earned")}>
                                    <Row gap="$xs">
                                        <Text bold>{formatDecimal(data?.earned ?? 0)}</Text>
                                        <Button
                                            h={18}
                                            px="$xs"
                                            br="$xs"
                                            onPress={() => {
                                                useStatementStore.setState({
                                                    current: 7,
                                                })
                                                router.push("/statement")
                                            }}
                                        >
                                            <Text caption col="$background">
                                                {t("action.query")}
                                            </Text>
                                        </Button>
                                    </Row>
                                </Statistics>
                                <Statistics label={dict.updated} ai="flex-end">
                                    <Text>
                                        {data?.lastUpdateTime
                                            ? dayjs(data?.lastUpdateTime).format("MMM DD, YYYY HH:mm:ss")
                                            : ""}
                                    </Text>
                                </Statistics>
                            </Justified>
                        </Card>
                    </Moti>
                )}
            </AnimatePresence>
            <Popup visible={visible} onClose={() => {
                useStore.setState({ visible: false, users: [], currentIndex: 0 })
            }} closeOnTouchOutside>
                <Dialog py="$md" px="$md" w={DEVICE_WIDTH - 32}>
                    <Text heading>{`${userId ?? dict.mine}${dict.partnerList}`}</Text>
                    <FlatList
                        horizontal
                        style={{
                            width: DEVICE_WIDTH - 32,
                            height: 230,
                            marginHorizontal: -16,
                        }}
                        pagingEnabled
                        ref={ref}
                        // centerContent
                        showsHorizontalScrollIndicator={false}
                        onScroll={(event) => {
                            useStore.setState(
                                { currentIndex: Math.round(event.nativeEvent.contentOffset.x / (DEVICE_WIDTH - 32)) }
                            )
                        }}
                        ListEmptyComponent={ListEmptyComponent}
                        data={refreshing ? [] : referral}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                    />
                    <XStack gap="$md">
                        <Button size="$md" f={1} type="accent" onPress={() => {
                            const current = users.filter((it) => it !== userId)
                            if (users.length) {
                                useStore.setState({ users: current })
                            } else {
                                useStore.setState({ visible: false })
                            }
                        }}>
                            {t("action.back")}
                        </Button>
                        {referral?.[currentIndex]?.teamSize ? (
                            <Button size="$md" f={1} type="primary" onPress={() => {
                                useStore.setState({
                                    users: [...users, referral?.[currentIndex]?.userId!]
                                })
                            }}>
                                {t("action.view")}
                            </Button>
                        ) : null}
                    </XStack>

                </Dialog>
                <XStack w="100%" ai="center" jc="center" pt={12} gap="$xs">
                    {referral?.map((it, index) => (
                        <XStack
                            key={it.userId}
                            w={index === currentIndex ? 12 : "$xs"}
                            h="$xs"
                            bc={index === currentIndex ? "$primary" : "$secondary"}
                            br="$xs"
                        />
                    ))}
                </XStack>
            </Popup>
        </Fragment>
    )
}
