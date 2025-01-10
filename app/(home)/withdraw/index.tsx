import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ScrollView, YStack } from "~/components"
import { AccountCard } from "~/widgets/shared/account-card"
import { WithdrawMethods } from "~/widgets/shared/payment-methods"
import { TwoFactorCard } from "~/widgets/shared/two-factor-card"
import { VerificationCard } from "~/widgets/shared/validation-card"

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.withdrawal") }} />
      <YStack p="$md" gap={20} pb={bottom + 16}>
        <YStack gap={12}>
          <AccountCard />
          <VerificationCard />
          <TwoFactorCard />
        </YStack>
        <YStack gap={12}>
          <WithdrawMethods />
        </YStack>
      </YStack>
    </ScrollView>
  )
}
