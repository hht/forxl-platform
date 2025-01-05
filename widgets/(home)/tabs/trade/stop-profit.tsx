import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { ProfitTracker } from "./profit-tracker"

import { Collapse, Input } from "~/components"
import { useQuotesStore } from "~/hooks/useStore"

const toggleExpended = (enableCloseProfit: boolean) => {
  useQuotesStore.setState({ enableCloseProfit })
  if (enableCloseProfit) {
    useQuotesStore.getState().updateOrder({
      stopProfitPrice: useQuotesStore.getState().getOrderPrice(1),
    })
  }
}

export const StopProfitCard: FC<{ futuresOrder: FuturesOrder }> = ({
  futuresOrder,
}) => {
  const { t } = useTranslation()
  const { enableCloseProfit, action, order, enablePending } = useQuotesStore(
    (s) => ({
      enableCloseProfit: s.enableCloseProfit,
      enablePending: s.enablePending,
      action: s.action,
      order: s.order,
    }),
    shallow
  )
  return (
    <Collapse
      title={t(action === "buy" ? "trade.buyWhen" : "trade.sellWhen")}
      expended={enableCloseProfit}
      toggleExpended={toggleExpended}
      disabled={order?.position === 0}
    >
      <Input.Digit
        value={order?.stopProfitPrice}
        precision={futuresOrder?.volatility?.toString().split(".")[1]?.length}
        step={futuresOrder.volatility! * 100}
        onChange={(stopProfitPrice) => {
          useQuotesStore.getState().updateOrder({
            stopProfitPrice,
          })
        }}
      />
      <ProfitTracker
        order={futuresOrder}
        enablePending={enablePending}
        current={order?.stopProfitPrice}
      />
    </Collapse>
  )
}
