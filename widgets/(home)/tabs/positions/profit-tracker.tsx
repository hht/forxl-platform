import _ from "lodash"
import { FC } from "react"
import { XStack } from "tamagui"

import { AnimatedFlow, Text } from "~/components"
import { computeProfit } from "~/hooks/useStore"
import { t } from "~/lib/utils"

export const ProfitTracker: FC<{
  order: FuturesOrder
  current?: number
  enablePending?: boolean
}> = ({ current, order }) => {
  if (!current || !order) return null
  const profit = computeProfit(
    {
      ...order,
      tradingFee: 0,
      overNightFee: 0,
      price: current,
      overPrice: current,
    },
    {
      Ask: order.price!,
      Bid: order.price!,
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
