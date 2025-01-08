import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useProfitAndLossStore } from "./profit-loss"

import { updateOrder } from "~/api/trade"
import { Button, toast, XStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useOrderStore } from "~/hooks/useStore"

export const OrderActions = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { run, loading } = useRequest(updateOrder, {
    manual: true,
    onSuccess: () => {
      toast.show(t("message.changePositionSuccess"))
    },
  })
  return (
    <XStack gap="$md" px="$md" pb={bottom + 16}>
      <Button
        f={1}
        type="accent"
        onPress={() => {
          useOrderStore.setState({
            willClosePosition: useOrderStore.getState().currentPosition,
          })
        }}
      >
        {t("positions.closePosition")}
      </Button>
      <Button
        f={1}
        isLoading={loading}
        onPress={() => {
          const currentPosition = useOrderStore.getState().currentPosition
          if (!currentPosition) return
          const {
            stopProfitPrice,
            stopLossPrice,
            enableCloseLoss,
            enableCloseProfit,
          } = useProfitAndLossStore.getState()
          if (enableCloseProfit) {
            if (
              currentPosition.openSafe === 0 &&
              stopProfitPrice &&
              stopProfitPrice <
                currentPosition.price! + currentPosition.volatility! * 100
            ) {
              toast.show(t("message.minProfitReached"))
              return
            }
            if (
              currentPosition.openSafe === 1 &&
              stopProfitPrice &&
              stopProfitPrice >
                currentPosition.price! - currentPosition.volatility! * 100
            ) {
              toast.show(t("message.maxProfitReached"))
              return
            }
          }

          if (enableCloseLoss) {
            if (
              currentPosition.openSafe === 0 &&
              stopLossPrice &&
              stopLossPrice >
                currentPosition.price! - currentPosition.volatility! * 100
            ) {
              toast.show(t("message.maxLossReached"))
              return
            }
            if (
              currentPosition.openSafe === 1 &&
              stopLossPrice &&
              stopLossPrice <
                currentPosition.price! + currentPosition.volatility! * 100
            ) {
              toast.show(t("message.minLossReached"))
              return
            }
          }
          run({
            orderId: currentPosition.id!,
            stopProfitPrice: enableCloseProfit ? (stopProfitPrice ?? 0) : 0,
            stopLossPrice: enableCloseLoss ? (stopLossPrice ?? 0) : 0,
          })
        }}
      >
        {t("order.apply")}
      </Button>
    </XStack>
  )
}
