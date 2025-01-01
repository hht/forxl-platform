import { XStack, YStack } from "~/components"
import { Linear } from "~/widgets/shared/shape"
import { WalletStatistics } from "~/widgets/shared/wallet-summary"

export default function Page() {
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <XStack f={1} bc="$red11Light"></XStack>
    </YStack>
  )
}
