import { router } from "expo-router"
import * as Sharing from "expo-sharing"
import { Fragment } from "react"
import { Trans, useTranslation } from "react-i18next"

import { getBonusInfo, getPartnerInfo } from "~/api/partner"
import {
  Button,
  Card,
  copyToClipboard,
  Figure,
  Statistics,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import {
  useForxlStore,
  usePartnerStore,
  useStatementStore,
} from "~/hooks/useStore"
import { formatCurrency, t } from "~/lib/utils"

const share = async () => {
  if (!(await Sharing.isAvailableAsync())) {
    copyToClipboard(
      `https://www.forxlmarkets.com/#/?code=${useForxlStore.getState().account?.inviteCode}`
    )
    toast.show(t("message.copiedSuccess"))
    return
  } else {
    await Sharing.shareAsync(
      `https://www.forxlmarkets.com/#/?code=${useForxlStore.getState().account?.inviteCode}`,
      {
        dialogTitle: t("anon.title"),
      }
    )
  }
}

export const ReferralInfo = () => {
  const { t } = useTranslation()
  const dict = t("referral", {
    returnObjects: true,
  })
  const { account } = useForxlStore()
  useRequest(getPartnerInfo, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        currentLevel: data?.level,
        partnerLevel: data?.level,
      })
    },
  })
  const { data: bonus } = useRequest(getBonusInfo)
  return (
    <Fragment>
      <YStack py={24} ai="center" jc="center">
        <Figure name="giftBox" />
      </YStack>
      <YStack ai="center" jc="center" px="$lg" gap="$sm">
        <Text subject bold>
          {dict.invite}
        </Text>
        <Text subject bold>
          <Trans
            i18nKey="referral.bonus"
            values={{
              percent: 30,
            }}
            components={{
              1: <Text subject bold col="$primary" />,
            }}
          ></Trans>
        </Text>
        <Text ta="center" col="$secondary">
          {t("referral.bonusDesc", { percent: 30 })}
        </Text>
      </YStack>
      <Card bc="$card" my="$lg">
        <XStack
          bbc="$border"
          w="100%"
          bbw={1}
          ai="center"
          jc="space-between"
          gap="$md"
          p="$md"
        >
          <Statistics label={dict.earned}>
            <XStack ai="center" gap="$sm">
              <Text heading bold>
                {formatCurrency(bonus?.earned ?? 0)}
              </Text>
              <Button
                mah={18}
                px={4}
                br={2}
                ai="center"
                jc="center"
                onPress={() => {
                  useStatementStore.setState({
                    current: 6,
                  })
                  router.push("/statement")
                }}
              >
                <Text caption col="$background">
                  {t("action.query")}
                </Text>
              </Button>
            </XStack>
          </Statistics>
          <Statistics
            label={dict.spillover}
            info={
              <YStack gap="$md">
                <Text ta="center" subject>
                  {dict.spillover}
                </Text>
                <Text ta="center" lh={18} col="$secondary">
                  {dict.spilloverDesc}
                </Text>
              </YStack>
            }
          >
            {formatCurrency(bonus?.spillover ?? 0)}
          </Statistics>
        </XStack>
        <YStack gap="$md">
          <Text col="$secondary" caption>
            {dict.useCode}
          </Text>
          <XStack bc="$accent" br="$sm" p="$md" ai="center" jc="space-between">
            <Text>{account?.inviteCode}</Text>
            <XStack
              onPress={() => {
                copyToClipboard(account?.inviteCode!)
              }}
            >
              <Text col="$primary">{t("action.copy")}</Text>
            </XStack>
          </XStack>
          <Button size="$md" onPress={share}>
            {dict.share}
          </Button>
        </YStack>
      </Card>
    </Fragment>
  )
}
