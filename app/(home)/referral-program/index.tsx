import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getBonusConfig, getPartnerConfig } from "~/api/partner"
import {
  Figure,
  IconType,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { usePartnerStore } from "~/hooks/useStore"
import { DEVICE_WIDTH, formatDecimal } from "~/lib/utils"
import { AccountInfo } from "~/widgets/(home)/referral-program/account-info"
import { ReferralInfo } from "~/widgets/(home)/referral-program/referral-info"

const LEVEL_ICON: IconType[] = ["user", "pair", "group"]

export default function Layout() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("referral", {
    returnObjects: true,
  })

  const { data: bonus } = useRequest(getBonusConfig)
  useRequest(getPartnerConfig, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        config: data,
      })
    },
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: t("profile.referralProgram") }} />
      <XStack pos="absolute" t={0} l={0} r={0}>
        <Figure name="grid" width={DEVICE_WIDTH} height={DEVICE_WIDTH} />
      </XStack>
      <ScrollView f={1} px="$md" showsVerticalScrollIndicator={false}>
        <ReferralInfo />
        <AccountInfo />
        <YStack py="$md">
          <Text subject bold>
            {dict.benefits.title}
          </Text>
          {LEVEL_ICON.map((it, index) => (
            <XStack
              key={index}
              py="$md"
              w="100%"
              ai="center"
              jc="space-between"
            >
              <Text col="$secondary">
                {t("referral.benefits.generation", { generation: index + 1 })}
              </Text>
              <Text>
                {t("referral.benefits.perLot", {
                  amount: formatDecimal(
                    bonus?.[
                      `generation${index + 1}` as
                        | "generation1"
                        | "generation2"
                        | "generation3"
                    ] ?? 0
                  ),
                })}
              </Text>
            </XStack>
          ))}
        </YStack>
        <XStack pb={bottom + 16}></XStack>
      </ScrollView>
    </YStack>
  )
}
