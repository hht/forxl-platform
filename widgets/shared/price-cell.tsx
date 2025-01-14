import { FC, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { AnimatedFlow } from '~/components'
import { useQuotesStore } from '~/hooks/useStore'
import colors from '~/theme/colors'

export const PriceCell: FC<{ data: Position; color?: string }> = ({
  data,
  color = colors.text,
}) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const diff = useMemo(
    () => ((data.volatility ?? 0) * (data.clazzSpread ?? 0)) / 2,
    [data.volatility, data.clazzSpread]
  )
  return (
    <AnimatedFlow
      value={
        ((data.openSafe === 0 ? quotes?.Bid : quotes?.Ask) ??
          data.overPrice ??
          data.lastPrice ??
          data.price) - (data.openSafe! === 0 ? diff : -diff)
      }
      fraction={data.volatility}
      color={color}
    ></AnimatedFlow>
  )
}
