import { FC } from "react"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Row } from "~/components"
import { computeProfit, useQuotesStore } from "~/hooks/useStore"

export const ProfitCell: FC<{
  data: Position
  fontSize?: number
  bold?: boolean
}> = ({ data, fontSize = 13, bold = false }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const profit = computeProfit({
    ...data,
    positionsProfit: data.pureProfit ?? data.positionsProfit,
    tradingFee: 0,
    overNightFee: 0,
  })
  return (
    <Row ai="baseline" gap="$xs">
      <AnimatedFlow
        value={profit}
        fontSize={fontSize}
        addonsBefore="$"
        bold={bold}
      ></AnimatedFlow>
      <AnimatedFlow
        value={(profit / (data.securityDeposit ?? 1)) * 100}
        fontSize={fontSize * 0.8}
        addonsBefore=""
        addonsAfter="%"
        bold={bold}
      ></AnimatedFlow>
    </Row>
  )
}
