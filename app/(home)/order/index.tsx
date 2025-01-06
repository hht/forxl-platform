import { Stack } from "expo-router"

import { YStack } from "~/components"
import { FutureDetail } from "~/widgets/(home)/order/future-detail"
import { OrderActions } from "~/widgets/(home)/order/order-actions"
import { Linear } from "~/widgets/shared/shape"
import { WalletStatistics } from "~/widgets/shared/wallet-summary"

export default function Page() {
  return (
    <YStack f={1}>
      <Stack.Screen options={{ headerShown: false }} />
      <Linear />
      <WalletStatistics />
      <FutureDetail />
    </YStack>
  )
}
