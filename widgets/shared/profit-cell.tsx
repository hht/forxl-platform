import { FC } from "react"
import { shallow } from "zustand/shallow"

import { AnimatedFlow } from "~/components"
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
  const profit = computeProfit({ ...data, tradingFee: 0, overNightFee: 0 })
  return (
    <AnimatedFlow
      value={profit}
      fontSize={fontSize}
      addonsBefore={`$${profit > 0 ? "+" : ""}`}
      bold={bold}
    ></AnimatedFlow>
  )
}
