import { Icon, XStack, YStack } from "~/components"
import { FutureCategories } from "~/widgets/(home)/tabs/trade/categories"
import { FutureList } from "~/widgets/(home)/tabs/trade/list"
import { Linear } from "~/widgets/shared/shape"
import { WalletStatistics } from "~/widgets/shared/wallet-summary"

export default function Page() {
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <YStack f={1}>
        <XStack p="$md" ai="center" jc="space-between">
          <FutureCategories />
          <XStack hitSlop={16} onPress={() => {}}>
            <Icon name="search" size={20}></Icon>
          </XStack>
        </XStack>
        <FutureList />
      </YStack>
    </YStack>
  )
}
