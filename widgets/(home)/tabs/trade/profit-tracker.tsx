import _ from "lodash"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Text, XStack } from "~/components"
import { computeProfit, useQuotesStore } from "~/hooks/useStore"

export const ProfitTracker: FC<{
  order: FuturesOrder
  current?: number
  enablePending?: boolean
}> = ({ current, order, enablePending }) => {
  const { t } = useTranslation()
  const quotes = useQuotesStore(
    (state) => state.quotes[order.futuresCode!],
    shallow
  )
  if (!current || !order) return null
  const currentPrice = order.openSafe === 0 ? quotes?.Ask : quotes?.Bid
  const profit = computeProfit(
    {
      ...order,
      tradingFee: 0,
      overNightFee: 0,
      price: enablePending ? order.price : (currentPrice ?? order.price),
      overPrice: current,
    },
    {
      Ask: current,
      Bid: current,
    }
  )
  return (
    <XStack gap="$sm">
      <Text col="$secondary" fos={11}>
        {t("trade.profit")}:
      </Text>
      <XStack>
        <AnimatedFlow
          value={_.floor(profit, 2)}
          fraction={0.01}
          addonsBefore="$"
          col={profit >= 0 ? "$primary" : "$destructive"}
          fos={11}
        />
        <AnimatedFlow
          value={(_.floor(profit, 2) / current) * 100}
          fraction={0.01}
          addonsBefore="("
          addonsAfter="%)"
          col={profit >= 0 ? "$primary" : "$destructive"}
          fos={11}
        />
      </XStack>
    </XStack>
  )
}
