import { useUnmount } from "ahooks"
import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { Card, ScrollView, YStack } from "~/components"
import { useOrderStore } from "~/hooks/useStore"
import { OrderActions } from "~/widgets/(home)/position/order-actions"
import { OrderDetail } from "~/widgets/(home)/position/order-detail"
import { ProfitAndLoss } from "~/widgets/(home)/position/profit-loss"

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("order", {
    returnObjects: true,
  })
  const { currentPosition, activeIndex } = useOrderStore(
    (state) => ({
      currentPosition: state.currentPosition,
      activeIndex: state.activeIndex,
    }),
    shallow
  )

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
    </YStack>
  )
}
