import _ from "lodash"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
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
  Popup,
  Row,
  ScrollView,
  Statistics,
  Text,
  XStack,
  YStack,
} from "~/components"
import { formatDate } from "~/hooks/useLocale"
import { useRequest } from "~/hooks/useRequest"
import { useFroxlStore, usePartnerStore } from "~/hooks/useStore"
import { DEVICE_WIDTH, formatDecimal } from "~/lib/utils"

export const AccountInfo = () => {
  const { account } = useFroxlStore()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const currentLevel = usePartnerStore((state) => state.partnerLevel, shallow)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const { data: referral } = useRequest(getReferralList)
  const { data } = useRequest(getPartnerInfo, {
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
  return (
    <Fragment>
      <Card gap="$md">
        <XStack gap={12}>
          <Figure name={LEVELS[currentLevel]} width={48} height={50} />
          <YStack gap="$sm">
            <Text col="$secondary">{dict.level}</Text>
            <XStack ai="center" gap="$sm">
              <Text subject>{_.upperCase(dict.children[currentLevel])}</Text>
              <XStack hitSlop={10} onPress={() => setVisible(true)}>
                <Icon name="info" size={16} />
              </XStack>
            </XStack>
          </YStack>
        </XStack>
        <Justified>
          <Statistics label={t("referral.accounts")}>
            <Row gap="$sm">
              <Text fos={17} lh={20} fow="700">
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
                  `https://www.FORXLMARKETS.COM/CODE=${account?.inviteCode}`
                )
              }}
            >
              <Text fow="bold" col="$background">
                {t("action.share")}
              </Text>
            </Button>
          </Statistics>
        </Justified>
        <Justified>
          <Statistics label={dict.size}>
            <Text fow="700">
              {t("partner.personCount", { count: data?.teamSize })}
            </Text>
          </Statistics>
          <Statistics label={dict.volume} jc="flex-end">
            <Text>{`$${formatDecimal(data?.teamVolume ?? 0)}`}</Text>
          </Statistics>
        </Justified>
        <Justified>
          <Statistics label={t("referral.earned")}>
            <Row gap="$xs">
              <Text fow="700">{`$${formatDecimal(data?.earned ?? 0)}`}</Text>
              <Button h={18} px="$xs" br="$xs" onPress={() => {}}>
                <Text caption col="$background">
                  {t("action.query")}
                </Text>
              </Button>
            </Row>
          </Statistics>
          <Statistics label={dict.updated} ai="flex-end">
            <Text>
              {data?.lastUpdateTime ? formatDate(data?.lastUpdateTime) : ""}
            </Text>
          </Statistics>
        </Justified>
      </Card>

      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog py="$md" px="$md" w={DEVICE_WIDTH - 32}>
          <Text head>{dict.partnerList}</Text>
          <ScrollView
            horizontal
            w={DEVICE_WIDTH - 32}
            h={212}
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
                    <XStack gap="$xs" ai="center">
                      <Text col="$secondary">{t("partner.accountId")}</Text>
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
                      {item.email}
                    </Text>
                  </Justified>
                  <Justified>
                    <Text col="$secondary">{dict.CertificationName}</Text>
                    <Text>
                      {item.certificationName
                        ?.split(" ")
                        .map((it, index) =>
                          index === 0
                            ? _.padEnd(it.charAt(0), it.length, "*")
                            : it
                        )
                        .join(" ")}
                    </Text>
                  </Justified>
                  <Justified>
                    <Text col="$secondary">{dict.size}</Text>
                    <Text>
                      {t("partner.personCount", { count: item.teamSize })}
                    </Text>
                  </Justified>
                  <Justified>
                    <Text col="$secondary">{t("partner.fundsInvested")}</Text>
                    <Text>{`$${formatDecimal(`${item.invested}`)}`}</Text>
                  </Justified>
                  <Justified>
                    <Text col="$secondary">{t("partner.registerDate")}</Text>
                    <Text>
                      {formatDate(item.registrationDate ?? Date.now(), {
                        hour: undefined,
                        minute: undefined,
                      })}
                    </Text>
                  </Justified>
                </YStack>
              ))
            ) : (
              <YStack h="100%" ai="center" jc="center">
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
