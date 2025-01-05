import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { ProfitTracker } from "./profit-tracker"

import { Collapse, Input } from "~/components"
import { useQuotesStore } from "~/hooks/useStore"

const toggleExpended = (enableCloseLoss: boolean) => {
  useQuotesStore.setState({ enableCloseLoss })
  if (enableCloseLoss) {
    useQuotesStore.getState().updateOrder({
      stopLossPrice: useQuotesStore.getState().getOrderPrice(1),
    })
  }
}

export const StopLossCard: FC<{ futuresOrder: FuturesOrder }> = ({
  futuresOrder,
}) => {
  const { t } = useTranslation()
  const { enableCloseLoss, action, order, enablePending } = useQuotesStore(
    (s) => ({
      enableCloseLoss: s.enableCloseLoss,
      enablePending: s.enablePending,
      action: s.action,
      order: s.order,
    }),
    shallow
  )
  return (
    <Collapse
      title={t(action === "buy" ? "trade.buyWhen" : "trade.sellWhen")}
      expended={enableCloseLoss}
      toggleExpended={toggleExpended}
      disabled={order?.position === 0}
    >
      <Input.Digit
        value={order?.stopLossPrice}
        precision={futuresOrder?.volatility?.toString().split(".")[1]?.length}
        step={futuresOrder.volatility! * 100}
        onChange={(stopLossPrice) => {
          useQuotesStore.getState().updateOrder({
            stopLossPrice,
          })
        }}
      />
      <ProfitTracker
        order={futuresOrder}
        enablePending={enablePending}
        current={order?.stopLossPrice}
      />
    </Collapse>
  )
}
