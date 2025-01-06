import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { ProfitTracker } from '../tabs/trade/profit-tracker'

import { Collapse, Icon, Input, Text, XStack } from '~/components'
import { usePromptStore, useQuotesStore } from '~/hooks/useStore'
import { uuid } from '~/lib/utils'

const toggleExpended = (enableCloseProfit: boolean) => {
  useQuotesStore.setState({ enableCloseProfit })
  if (enableCloseProfit) {
    useQuotesStore.getState().updateOrder({
      stopProfitPrice: useQuotesStore.getState().getOrderPrice(1),
    })
  }
}

const Title: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack ai="center" gap="$sm">
      <Text fow="bold">{t("trade.closeProfit")}</Text>
      <XStack
        hitSlop={16}
        onPress={() => {
          usePromptStore.setState({
            title: t("trade.closeProfit"),
            desc: t("trade.closeProfitDesc"),
            reloadKey: uuid(),
          })
        }}
      >
        <Icon name="info" size={12} color="$secondary" />
      </XStack>
    </XStack>
  )
}

export const StopProfitCard: FC<{ futuresOrder: FuturesOrder }> = ({
  futuresOrder,
}) => {
  const { enableCloseProfit, order, enablePending, disabled } = useQuotesStore(
    (s) => ({
      enableCloseProfit: s.enableCloseProfit,
      enablePending: s.enablePending,
      order: s.order,
      disabled:
        !s.currentFuture?.isDeal || !s.quotes[s.currentFuture?.futuresShow!],
    }),
    shallow
  )
  return (
    <Collapse
      title={<Title />}
      expended={enableCloseProfit}
      toggleExpended={toggleExpended}
      disabled={order?.position === 0 || disabled}
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
