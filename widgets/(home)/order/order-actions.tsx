import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack } from "tamagui"
import { shallow } from "zustand/shallow"

import {
  getOpenPositions,
  getPendingPositions,
  proceedOrder,
} from "~/api/trade"
import { Button, toast } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useForxlStore, useQuotesStore } from "~/hooks/useStore"

export const OrderActions: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { loading, run } = useRequest(proceedOrder, {
    manual: true,
    onSuccess: () => {
      if (useQuotesStore.getState().enablePending) {
        getPendingPositions()
      } else {
        getOpenPositions()
      }
      useQuotesStore.setState({ order: { position: 0.01 } })
      toast.show(t("message.orderSuccess"))
    },
  })
  const {
    action,
    order,
    enablePending,
    disabled,
    enableCloseLoss,
    enableCloseProfit,
  } = useQuotesStore(
    (state) => ({
      action: state.action,
      order: state.order,
      enablePending: state.enablePending,
      enableCloseLoss: state.enableCloseLoss,
      enableCloseProfit: state.enableCloseProfit,
      disabled:
        !state.currentFuture?.isDeal ||
        !state.quotes[state.currentFuture?.futuresCode!],
    }),
    shallow
  )

  if (disabled) {
    return null
  }
  const checkOrderValid = () => {
    const {
      order,
      currentFuture,
      action,
      enableCloseLoss,
      enableCloseProfit,
      enablePending,
      quotes,
    } = useQuotesStore.getState()

    // 基础检查
    if (
      !currentFuture?.isDeal ||
      !order?.position ||
      (enablePending && !order?.price)
    ) {
      return false
    }

    const quoteData = quotes[currentFuture.futuresCode!]
    if (!quoteData) {
      return false
    }

    // 止盈检查
    if (enableCloseProfit && order.stopProfitPrice) {
      const orderPrice = useQuotesStore.getState().getOrderPrice(1)
      if (
        (action === "buy" && orderPrice > order.stopProfitPrice) ||
        (action === "sell" && orderPrice < order.stopProfitPrice)
      ) {
        return false
      }
    }

    // 止损检查
    if (enableCloseLoss && order.stopLossPrice) {
      const orderPrice = useQuotesStore.getState().getOrderPrice(-1)
      if (
        (action === "buy" && orderPrice < order.stopLossPrice) ||
        (action === "sell" && orderPrice > order.stopLossPrice)
      ) {
        return false
      }
    }

    return true
  }
  return (
    <YStack p="$md" pb={bottom + 16}>
      <Button
        isLoading={loading}
        type={
          enablePending
            ? "accent"
            : action === "buy"
              ? "primary"
              : "destructive"
        }
        disabled={
          loading ||
          !checkOrderValid() ||
          !order?.position ||
          (enablePending && !order?.price)
        }
        onPress={() => {
          const {
            order,
            currentFuture,
            action,
            enableCloseLoss,
            enableCloseProfit,
            enablePending,
          } = useQuotesStore.getState()
          const quotes =
            useQuotesStore.getState().quotes[
              useQuotesStore.getState().currentFuture!.futuresCode!
            ]
          if (!currentFuture?.isDeal) {
            toast.show(t("trade.notInTradeTime"))
            return
          }
          if (!quotes) {
            toast.show(t("trade.noQuotes"))
            return
          }
          if (enableCloseProfit) {
            const orderPrice = useQuotesStore.getState().getOrderPrice(1)
            if (
              action === "buy" &&
              order?.stopProfitPrice &&
              orderPrice > order?.stopProfitPrice
            ) {
              toast.show(t("message.minProfitReached"))
              return
            }
            if (
              action === "sell" &&
              order?.stopProfitPrice &&
              orderPrice < order?.stopProfitPrice
            ) {
              toast.show(t("message.maxProfitReached"))
              return
            }
          }

          if (enableCloseLoss) {
            const orderPrice = useQuotesStore.getState().getOrderPrice(-1)
            if (
              action === "buy" &&
              order?.stopLossPrice &&
              orderPrice < order?.stopLossPrice
            ) {
              toast.show(t("message.maxProfitReached"))
              return
            }
            if (
              action === "sell" &&
              order?.stopLossPrice &&
              orderPrice > order?.stopLossPrice
            ) {
              toast.show(t("message.minProfitReached"))
              return
            }
          }
          const currentPrice = enablePending
            ? (order?.price ?? 0)
            : action === "buy"
              ? quotes!.Bid
              : quotes!.Ask

          run({
            futuresId: useQuotesStore.getState().currentFuture!.futuresId!,
            byOrSell: enablePending ? 7 : 0,
            positions: {
              spId: useForxlStore.getState().account!.spId!,
              position: order!.position!,
              price: currentPrice,
              isOverNight: 1,
              openSafe: action === "buy" ? 0 : 1,
              stopLossPrice:
                enableCloseLoss && order?.stopLossPrice
                  ? order.stopLossPrice
                  : 0,
              stopProfitPrice:
                enableCloseProfit && order?.stopProfitPrice
                  ? order.stopProfitPrice
                  : 0,
            },
          })
        }}
      >
        {enablePending
          ? t("order.placeOrder")
          : action === "buy"
            ? t("trade.buy")
            : t("trade.sell")}
      </Button>
    </YStack>
  )
}
