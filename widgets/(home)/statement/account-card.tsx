import { useTranslation } from "react-i18next"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { getAssets } from "~/api/wallet"
import {
  Card,
  Icon,
  Separator,
  Statistics,
  Text,
  XStack,
  YStack,
} from "~/components"
import { getDate } from "~/hooks/useLocale"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useStatementStore } from "~/hooks/useStore"
import { formatCurrency } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

export const AccountCard = () => {
  const { t } = useTranslation()
  const { updatedAt } = useStatementStore()
  const { data: assets, refresh } = useRequest(getAssets, {
    onBefore: async () => {
      process.value = withTiming(360, { duration: 1000 }, async () => {
        process.value = 0
      })
    },
    onSuccess: async (data) => {
      useStatementStore.setState({ updatedAt: Date.now() })
    },
    cacheKey: CACHE_KEY.ASSETS,
  })
  const process = useSharedValue(0)
  const refreshStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${process.value}deg` }],
    }
  })
  return (
    <YStack p="$md" h={180} bc="$background">
      <Card bc={toRGBA(colors.primary, 0.1)} px="$md" jc="center">
        <XStack ai="center" jc="space-between">
          <XStack gap="$sm" ai="center">
            <Icon name="account" size={20} color={colors.primary} />
            <Text heading bold>
              {t("wallet.myAccount")}
            </Text>
          </XStack>
          <XStack ai="center" gap="$xs" onPress={refresh}>
            <Animated.View style={refreshStyle}>
              <Icon name="refresh" size={16} />
            </Animated.View>
            <Text col="$secondary">
              {t("wallet.updatedAt", {
                time: getDate(updatedAt).format("hh:mm A"),
              })}
            </Text>
          </XStack>
        </XStack>
        <Separator my="$md" />
        <XStack jc="space-between">
          <Statistics label={t("wallet.available")}>
            <Text title>
              {formatCurrency(
                assets?.userWalletDetail?.fundsAccount.available ?? "0"
              )}
            </Text>
          </Statistics>
          <Statistics label={t("wallet.equity")} ai="flex-end">
            <Text title>
              {formatCurrency(
                assets?.userWalletDetail?.fundsAccount.equity ?? "0"
              )}
            </Text>
          </Statistics>
        </XStack>
      </Card>
    </YStack>
  )
}
