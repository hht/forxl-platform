import { YStack } from "~/components"
import { FutureList } from "~/widgets/(home)/tabs/trade/future-list"
import { FuturesChart } from "~/widgets/(home)/tabs/trade/futures-chart"
import { Linear } from "~/widgets/shared/shape"
import { WalletStatistics } from "~/widgets/shared/wallet-summary"

export default function Page() {
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <FutureList />
      <FuturesChart />
    </YStack>
  )
}
