import _ from "lodash"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Card, Input, Text, XStack, YStack } from "~/components"
import { useQuotesStore, useStatisticsStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"

export const TradeVolume: FC<{ future?: FuturesDetail }> = ({ future }) => {
  const { t } = useTranslation()
  const available = useStatisticsStore((state) => state?.available, shallow)
  const order = useQuotesStore((state) => state.order, shallow)
  const requiredMargin = future
    ? (order?.position ?? 0) * (future.futuresParam?.fixDepositRatio ?? 0)
    : 0
  return (
    <Card bw={0}>
      <XStack ai="center" jc="space-between">
        <Text fow="bold">{t("positions.volume")}</Text>
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
          <Text fos={11} col="$primary">
            {t("trade.max")}
          </Text>
        </XStack>
      </XStack>
      <Input.Digit
        value={order?.position}
        min={future?.futuresParam?.minVolume}
        max={future?.futuresParam?.maxVolume}
        step={0.01}
        onChange={(v) => {
          useQuotesStore.getState().updateOrder({ position: v })
        }}
      />
      <XStack ai="center" jc="space-between">
        <YStack>
          <Text fos={11} col="$secondary">
            {t("trade.requiredMargin")}
          </Text>
          <Text
            fos={11}
            col="$secondary"
          >{`$${formatDecimal(requiredMargin)}`}</Text>
        </YStack>
        <YStack ai="flex-end">
          <Text fos={11} col="$secondary">
            {t("trade.freeMargin")}
          </Text>
          <AnimatedFlow
            addonsBefore="$"
            value={available}
            fos={11}
            col="$secondary"
          />
        </YStack>
      </XStack>
    </Card>
  )
}
