import _ from "lodash"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { XStack } from "tamagui"

import { AnimatedFlow, Text } from "~/components"
import { computeProfit } from "~/hooks/useStore"

export const ProfitTracker: FC<{
  order: FuturesOrder
  current?: number
  enablePending?: boolean
}> = ({ current, order }) => {
  const { t } = useTranslation()
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
    <XStack gap="$sm" ai="center">
      <Text col="$secondary" caption>
        {t("trade.profit")}:
      </Text>
      <XStack ai="center">
        <AnimatedFlow
          value={_.floor(profit, 2)}
          fraction={0.01}
          addonsBefore="$"
          fontSize={11}
        />
        <AnimatedFlow
          value={(_.floor(profit, 2) / current) * 100}
          fraction={0.01}
          addonsBefore="("
          addonsAfter="%)"
          fontSize={11}
        />
      </XStack>
    </XStack>
  )
}
