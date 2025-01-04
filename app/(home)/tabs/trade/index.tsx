import { XStack, YStack } from '~/components'
import { Linear } from '~/widgets/shared/shape'
import { WalletStatistics } from '~/widgets/shared/wallet-summary'

export default function Page() {
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <YStack f={1}>
        <XStack></XStack>
      </YStack>
    </YStack>
  )
}
