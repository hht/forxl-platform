import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { AnimatedFlow, Collapse, Icon, Input, Text, XStack } from '~/components'
import { usePromptStore, useQuotesStore } from '~/hooks/useStore'
import { uuid } from '~/lib/utils'

const toggleExpended = (enablePending: boolean) => {
  useQuotesStore.setState({ enablePending })
  useQuotesStore.getState().updateOrder({
    price: useQuotesStore.getState().getCurrentPrice(),
  })
}

const Title: FC = () => {
  const { t } = useTranslation()
  const action = useQuotesStore((s) => s.action, shallow)
  return (
    <XStack ai="center" gap="$sm">
      <Text fow="bold">
        {t(action === "buy" ? "trade.buyWhen" : "trade.sellWhen")}
      </Text>
      <XStack
        hitSlop={16}
        onPress={() => {
          usePromptStore.setState({
            title: t(action === "buy" ? "trade.buyWhen" : "trade.sellWhen"),
            desc: t("trade.rateDesc"),
            reloadKey: uuid(),
          })
        }}
      >
        <Icon name="info" size={12} color="$secondary" />
      </XStack>
    </XStack>
  )
}

const PriceTracker: FC<{ current?: number }> = ({ current }) => {
  const { t } = useTranslation()
  const price = useQuotesStore((state) => state.getCurrentPrice(), shallow)
  if (!price || !current) return null
  return (
    <XStack gap="$sm">
      <Text fos={11} col="$secondary">
        {t("trade.fromRate")}:
      </Text>
      <AnimatedFlow
        fos={11}
        value={((current - price) / price) * 100}
        addonsAfter="%"
        col="$secondary"
      />
    </XStack>
  )
}

export const PendingCard: FC<{ step?: number; precision: number }> = ({
  step = 0.01,
  precision = 2,
}) => {
  const { enablePending, order, disabled } = useQuotesStore(
    (s) => ({
      enablePending: s.enablePending,
      action: s.action,
      order: s.order,
      disabled:
        !s.currentFuture?.isDeal || !s.quotes[s.currentFuture?.futuresShow!],
    }),
    shallow
  )
  return (
    <Collapse
      title={<Title />}
      expended={enablePending}
      toggleExpended={toggleExpended}
      disabled={disabled}
    >
      <Input.Digit
        value={order?.price}
        step={step}
        precision={precision}
        min={0}
        onChange={(v) => {
          useQuotesStore.getState().updateOrder({ price: v })
        }}
      />
      <PriceTracker current={order?.price} />
    </Collapse>
  )
}
