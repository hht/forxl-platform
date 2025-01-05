import { useEffect, useRef } from "react"
import { shallow } from "zustand/shallow"

import { ScrollView, YStack } from "~/components"
import { useSymbolStore } from "~/hooks/useStore"
import { DEVICE_WIDTH } from "~/lib/utils"
import { FutureDetail } from "~/widgets/(home)/tabs/trade/future-detail"
import { FutureList } from "~/widgets/(home)/tabs/trade/future-list"
import { Linear } from "~/widgets/shared/shape"
import { WalletStatistics } from "~/widgets/shared/wallet-summary"

export default function Page() {
  const index = useSymbolStore((state) => state.index, shallow)
  const ref = useRef<ScrollView>(null)
  useEffect(() => {
    ref.current?.scrollTo({ x: DEVICE_WIDTH * index, animated: true })
  }, [index])
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <YStack f={1}>
        <ScrollView
          ref={ref}
          f={1}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}
        >
          <FutureList />
          <FutureDetail />
        </ScrollView>
      </YStack>
    </YStack>
  )
}
