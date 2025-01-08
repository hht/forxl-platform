import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { ProfitTracker } from '../tabs/trade/profit-tracker'

import { Collapse, Icon, Input, Text, XStack } from '~/components'
import { usePromptStore, useQuotesStore } from '~/hooks/useStore'
import { uuid } from '~/lib/utils'

const toggleExpended = (enableCloseLoss: boolean) => {
  useQuotesStore.setState({ enableCloseLoss })
  if (enableCloseLoss) {
    useQuotesStore.getState().updateOrder({
      stopLossPrice: useQuotesStore.getState().getOrderPrice(1),
    })
  }
}

const Title: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack ai="center" gap="$sm">
      <Text fow="bold">{t("trade.closeAtLoss")}</Text>
      <XStack
        hitSlop={16}
        onPress={() => {
          usePromptStore.setState({
            title: t("trade.closeAtLoss"),
            desc: t("trade.closeLossDesc"),
            reloadKey: uuid(),
          })
        }}
      >
        <Icon name="info" size={12} color="$secondary" />
      </XStack>
    </XStack>
  )
}

export const StopLossCard: FC<{ futuresOrder: FuturesOrder }> = ({
  futuresOrder,
}) => {
  const { enableCloseLoss, order, enablePending, disabled } = useQuotesStore(
    (s) => ({
      enableCloseLoss: s.enableCloseLoss,
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
      expended={enableCloseLoss}
      toggleExpended={toggleExpended}
      disabled={order?.position === 0 || disabled}
    >
      <Input.Digit
        value={order?.stopLossPrice}
        precision={futuresOrder?.volatility?.toString().split(".")[1]?.length}
        step={futuresOrder.volatility! * 100}
        onChange={(stopLossPrice) => {
          useQuotesStore.getState().updateOrder({
            stopLossPrice,
          })
        }}
      />
      <ProfitTracker
        order={futuresOrder}
        enablePending={enablePending}
        current={order?.stopLossPrice}
      />
    </Collapse>
  )
}
