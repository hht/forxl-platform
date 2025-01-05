import { FC } from "react"
import { TextProps } from "tamagui"
import { shallow } from "zustand/shallow"

import { AnimatedFlow } from "~/components"
import { computeProfit, useQuotesStore } from "~/hooks/useStore"

export const ProfitCell: FC<{ data: Position } & TextProps> = ({
  data,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const profit = computeProfit(data)
  return (
    <AnimatedFlow
      value={profit}
      addonsBefore={`$${profit > 0 ? "+" : ""}`}
      {...rest}
    ></AnimatedFlow>
  )
}
