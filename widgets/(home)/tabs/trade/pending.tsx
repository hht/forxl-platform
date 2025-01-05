import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Collapse, Input, Text, XStack } from "~/components"
import { useQuotesStore } from "~/hooks/useStore"

const toggleExpended = (enablePending: boolean) => {
  useQuotesStore.setState({ enablePending })
  useQuotesStore.getState().updateOrder({
    price: useQuotesStore.getState().getCurrentPrice(),
  })
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

export const PendingCard: FC = () => {
  const { t } = useTranslation()
  const { enablePending, action, order } = useQuotesStore(
    (s) => ({
      enablePending: s.enablePending,
      action: s.action,
      order: s.order,
    }),
    shallow
  )
  return (
    <Collapse
      title={t(action === "buy" ? "trade.buyWhen" : "trade.sellWhen")}
      expended={enablePending}
      toggleExpended={toggleExpended}
    >
      <Input.Digit
        value={order?.price}
        step={0.01}
        min={0}
        onChange={(v) => {
          useQuotesStore.getState().updateOrder({ price: v })
        }}
      />
      <PriceTracker current={order?.price} />
    </Collapse>
  )
}
