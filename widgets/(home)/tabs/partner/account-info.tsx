import * as Linking from "expo-linking"
import { router } from "expo-router"
import _ from "lodash"
import { AnimatePresence } from "moti"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator } from "react-native"
import { shallow } from "zustand/shallow"

import { LEVELS } from "./utils"

import {
  getPartnerConfig,
  getPartnerInfo,
  getReferralList,
} from "~/api/partner"
import {
  Button,
  Card,
  copyToClipboard,
  Dialog,
  Figure,
  Icon,
  Justified,
  Moti,
  Popup,
  Row,
  ScrollView,
  Statistics,
  Text,
  XStack,
  YStack,
} from "~/components"
import { formatDate } from "~/hooks/useLocale"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import {
  useForxlStore,
  usePartnerStore,
  usePromptStore,
  useStatementStore,
} from "~/hooks/useStore"
import {
  dayjs,
  DEVICE_WIDTH,
  formatCurrency,
  formatDecimal,
  uuid,
} from "~/lib/utils"

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

export const AccountInfo = () => {
  const { account } = useForxlStore()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const currentLevel = usePartnerStore((state) => state.partnerLevel, shallow)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const { data: referral } = useRequest(getReferralList)
  const { loading, data } = useRequest(getPartnerInfo, {
    cacheKey: CACHE_KEY.PARTNER,
    onSuccess: (data) => {
      usePartnerStore.setState({
        currentLevel: data?.level,
        partnerLevel: data?.level,
      })
    },
  })
  useRequest(getPartnerConfig, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        config: data,
      })
    },
  })
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
                <Figure name={LEVELS[currentLevel]} width={48} height={50} />
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
                          "https://www.forxlmarkets.com/#/partnership/become-a-partner"
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
                    <XStack hitSlop={10} onPress={() => setVisible(true)}>
                      <Icon name="info" size={16} />
                    </XStack>
                  </Row>
                </Statistics>
                <Statistics label={t("partner.earnBonuses")} jc="flex-end">
                  <Button
                    h={24}
                    onPress={() => {
                      copyToClipboard(
                        `https://www.forxlmarkets.com/#/?code=${account?.inviteCode}`
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
                      ? formatDate(data?.lastUpdateTime)
                      : ""}
                  </Text>
                </Statistics>
              </Justified>
            </Card>
          </Moti>
        )}
      </AnimatePresence>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog py="$md" px="$md" w={DEVICE_WIDTH - 32}>
          <Text heading>{dict.partnerList}</Text>
          <ScrollView
            horizontal
            w={DEVICE_WIDTH - 32}
            h={230}
            mx={-16}
            pagingEnabled
            centerContent
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              setCurrentIndex(
                event.nativeEvent.contentOffset.x / (DEVICE_WIDTH - 32)
              )
            }}
          >
            {referral?.length ? (
              referral?.map((item) => (
                <YStack
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
                          desc: t("partner.directAccountsDesc"),
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
                      <Figure
                        name={LEVELS[item.level!]}
                        width={20}
                        height={20}
                      />
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
                </YStack>
              ))
            ) : (
              <YStack h="100%" w={DEVICE_WIDTH - 32} ai="center" jc="center">
                <Figure name="empty" width={120} height={120} />
              </YStack>
            )}
          </ScrollView>
          <Button size="$md" type="accent" onPress={() => setVisible(false)}>
            {t("action.close")}
          </Button>
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
