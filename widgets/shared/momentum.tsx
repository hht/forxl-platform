import { FC } from 'react'

import { AnimatedFlow, Icon, XStack } from '~/components'

export const Momentum: FC<{
  data?: Future
  quotes: Pick<Quotes, "Bid"> & { BidDiff: number }
  className?: string
}> = ({ data, quotes, className }) => {
  if (!data || !data.isDeal || !data.lastClosePrice || !quotes?.Bid) {
    return null
  }
  const momentum =
    ((quotes.Bid - data.lastClosePrice) / data.lastClosePrice) * 100
  if (momentum) {
    return (
      <XStack>
        <Icon name="arrow" />
        <AnimatedFlow
          value={momentum}
          fraction={0.01}
          addonsBefore={momentum > 0 ? "+" : ""}
          addonsAfter="%"
        />
      </XStack>
    )
  }
  return null
}
