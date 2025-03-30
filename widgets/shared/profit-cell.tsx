import { FC, ReactNode } from 'react'
import { shallow } from 'zustand/shallow'

import { AnimatedFlow, Row, YStack } from '~/components'
import { computeProfit, useQuotesStore } from '~/hooks/useStore'

const ProfitWidget: FC<{ horizontal: boolean, children: ReactNode }> = ({ horizontal, children }) => {
  return horizontal ? <Row ai="baseline" gap="$xs">{children}</Row> : <YStack ai="flex-end" gap="$xs">{children}</YStack>
}

export const ProfitCell: FC<{
  data: Position
  fontSize?: number
  bold?: boolean
  horizontal?: boolean
}> = ({ data, fontSize = 13, bold = false, horizontal = true }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const profit = computeProfit(
    {
      ...data,
      positionsProfit: data.pureProfit ?? data.positionsProfit,
      tradingFee: 0,
      overNightFee: 0,
    },
    quotes
  )
  return (
    <ProfitWidget horizontal={horizontal}>
      <AnimatedFlow
        value={profit}
        fontSize={fontSize}
        addonsBefore="$"
        bold={bold}
      ></AnimatedFlow>
      <AnimatedFlow
        value={(profit / (data.securityDeposit ?? 1)) * 100}
        fontSize={fontSize}
        addonsBefore=""
        addonsAfter="%"
        bold={bold}
      ></AnimatedFlow>
    </ProfitWidget>
  )
}
