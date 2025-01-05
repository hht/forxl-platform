import BottomSheetBase from "@gorhom/bottom-sheet"
import { useUnmount } from "ahooks"
import { Stack } from "expo-router"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { BottomSheet, Card, ScrollView, Text, YStack } from "~/components"
import { useOrderStore } from "~/hooks/useStore"
import { OrderActions } from "~/widgets/(home)/order/order-actions"
import { OrderDetail } from "~/widgets/(home)/order/order-detail"
import { ProfitAndLoss } from "~/widgets/(home)/order/profit-loss"

const useStore = createWithEqualityFn<{ title?: string; desc?: string }>()(
  (set) => ({})
)

export default function Layout() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("order", {
    returnObjects: true,
  })
  const { title, desc } = useStore()
  const { currentPosition, activeIndex } = useOrderStore(
    (state) => ({
      currentPosition: state.currentPosition,
      activeIndex: state.activeIndex,
    }),
    shallow
  )

  const ref = useRef<BottomSheetBase>(null)

  useUnmount(() => {
    useOrderStore.setState({
      currentPosition: undefined,
    })
  })
  if (!currentPosition) return null
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: dict.title }} />
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack p="$md" gap="$sm">
          <Card gap="$sm">
            <OrderDetail />
          </Card>
          {activeIndex === 2 ? null : <ProfitAndLoss />}
        </YStack>
      </ScrollView>

      {activeIndex === 2 ? null : <OrderActions />}
      {desc ? (
        <BottomSheet title={title} ref={ref} index={0}>
          <YStack px="$md" pb={bottom + 16}>
            {desc ? (
              <Text fos={15} lh={20}>
                {desc}
              </Text>
            ) : null}
          </YStack>
        </BottomSheet>
      ) : null}
    </YStack>
  )
}
