import _ from "lodash"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Card, Input, Text, XStack, YStack } from "~/components"
import { useQuotesStore, useStatisticsStore } from "~/hooks/useStore"
import { formatCurrency } from "~/lib/utils"
import colors from "~/theme/colors"

export const TradeVolume: FC<{ future?: FuturesDetail }> = ({ future }) => {
  const { t } = useTranslation()
  const available = useStatisticsStore((state) => state.supFreezeMoney, shallow)
  const { order, disabled } = useQuotesStore(
    (state) => ({
      order: state.order,
      disabled:
        !state.currentFuture?.isDeal ||
        !state.quotes[state.currentFuture?.futuresCode!],
    }),
    shallow
  )
  const requiredMargin = future
    ? (order?.position ?? 0) * (future.futuresParam?.fixDepositRatio ?? 0)
    : 0
  return (
    <Card bw={0}>
      <XStack ai="center" jc="space-between">
        <Text bold>{t("trade.volume")}</Text>
        <XStack
          hitSlop={16}
          onPress={() => {
            useQuotesStore.getState().updateOrder({
              position: Math.min(
                _.floor(
                  (available ?? 0) /
                    (future?.futuresParam?.fixDepositRatio ?? 1),
                  2
                ),
                future?.futuresParam?.maxVolume ?? 1000
              ),
            })
          }}
        >
          <Text caption col="$primary">
            {t("trade.max")}
          </Text>
        </XStack>
      </XStack>
      <Input.Digit
        value={order?.position}
        min={0}
        max={future?.futuresParam?.maxVolume}
        step={0.01}
        editable={!disabled}
        onChange={(v) => {
          useQuotesStore.getState().updateOrder({ position: v })
        }}
      />
      <XStack ai="center" jc="space-between">
        <YStack>
          <Text caption col="$secondary">
            {t("trade.requiredMargin")}
          </Text>
          <Text caption col="$secondary">
            {formatCurrency(requiredMargin)}
          </Text>
        </YStack>
        <YStack ai="flex-end">
          <Text caption col="$secondary">
            {t("wallet.freeMargin")}
          </Text>
          <AnimatedFlow
            addonsBefore="$"
            value={available}
            fontSize={11}
            color={colors.secondary}
          />
        </YStack>
      </XStack>
    </Card>
  )
}
