import { AnimatePresence } from "moti"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { MarketInfo } from "./market-info"

import {
  AnimatedFlow,
  Icon,
  Justified,
  Moti,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useCandlestick } from "~/hooks/useCandlestick"
import { useCandlestickStore, useQuotesStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"
import { FutureChartWidget } from "~/widgets/shared/future-chart-widget"

const PriceIndicator: FC<{
  min?: number
  max?: number
  value: number
  unit: string
  volatility?: number
}> = ({ min = 0, max = 0, value = 0, unit, volatility }) => {
  const _min = Math.min(min, value)
  const _max = Math.max(max, value)
  const percentage = ((value - _min) / (_max - _min || 1)) * 100
  return (
    <Justified w="100%" gap="$sm">
      <Text f={1}>{`$${formatDecimal(_min, volatility)}`}</Text>
      <XStack
        bc="$card"
        br="$xs"
        w={180}
        h={22}
        ai="center"
        jc="center"
        pos="relative"
      >
        <Text fos={11} zIndex={10} col="$secondary">
          {unit}
        </Text>
        <Moti
          animate={{
            left: `${percentage}%`,
          }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: colors.primary,
            borderRadius: 1,
            transform: [{ translateX: -1.5 }],
          }}
        ></Moti>
      </XStack>
      <Text f={1} ta="right">{`$${formatDecimal(_max, volatility)}`}</Text>
    </Justified>
  )
}

const MoreInfo: FC<{ future: FuturesDetail }> = ({ future }) => {
  const { t } = useTranslation()
  const quotes = useQuotesStore(
    (state) => state.quotes[future.futures?.futuresCode!]
  )
  useCandlestick(future.futures?.futuresCode)
  const { minuteFive, hour, day } = useCandlestickStore()
  if (!future) {
    return null
  }
  const momentum =
    ((Number(quotes?.Bid ?? future.market?.sellPrice ?? 0) -
      (future.lastClosePrice ?? 1)) /
      (future.lastClosePrice ?? 1)) *
    100
  return (
    <YStack p="$md" gap={32}>
      <YStack gap={12}>
        <Text heading>{t("trade.priceChange")}</Text>
        <XStack ai="center" gap="$sm">
          <Text>{t("trade.priceChangeDesc")}</Text>
          <XStack ai="center">
            {momentum !== 0 ? (
              <XStack rotate={momentum > 0 ? "0deg" : "180deg"}>
                <Icon
                  name="arrow"
                  size={12}
                  color={momentum > 0 ? colors.primary : colors.destructive}
                />
              </XStack>
            ) : null}
            {momentum ? (
              <AnimatedFlow
                value={momentum}
                fraction={0.01}
                addonsBefore={momentum > 0 ? "+" : ""}
                addonsAfter="%"
              />
            ) : null}
          </XStack>
        </XStack>
        <XStack
          p="$md"
          boc="$border"
          bw={1}
          br="$md"
          ai="center"
          jc="space-between"
        >
          <YStack ai="center">
            <Text caption col="$secondary">
              {t("trade.mins", { count: 5 })}
            </Text>
            <Text>
              {(
                ((minuteFive.high - minuteFive.low) / (minuteFive.low || 1)) *
                100
              ).toFixed(2)}
              %
            </Text>
          </YStack>
          <YStack ai="center">
            <Text caption col="$secondary">
              {t("trade.hours", { count: 1 })}
            </Text>
            <Text>
              {(((hour.high - hour.low) / (hour.low || 1)) * 100).toFixed(2)}%
            </Text>
          </YStack>
          <YStack ai="center">
            <Text caption col="$secondary">
              {t("trade.days", { count: 1 })}
            </Text>
            <Text>
              {(((day.high - day.low) / (day.low || 1)) * 100).toFixed(2)}%
            </Text>
          </YStack>
        </XStack>
      </YStack>
      <YStack gap={12}>
        <Text heading>{t("trade.highLow")}</Text>
        <Text>
          {t("trade.currentSellPrice", {
            amount: formatDecimal(
              quotes?.Bid ?? 0 ?? future.market?.sellPrice ?? 0
            ),
          })}
        </Text>
        <PriceIndicator
          min={minuteFive?.low}
          max={minuteFive?.high}
          value={
            minuteFive.current ?? parseFloat(future.market?.sellPrice ?? "0")
          }
          unit={t("trade.mins", { count: 5 })}
          volatility={future.futuresParam?.volatility}
        />
        <PriceIndicator
          min={hour?.low}
          max={hour?.high}
          value={hour.current ?? parseFloat(future.market?.sellPrice ?? "0")}
          unit={t("trade.hours", { count: 1 })}
          volatility={future.futuresParam?.volatility}
        />
        <PriceIndicator
          min={day?.low}
          max={day?.high}
          value={day.current ?? parseFloat(future.market?.sellPrice ?? "0")}
          unit={t("trade.days", { count: 1 })}
          volatility={future.futuresParam?.volatility}
        />
      </YStack>
    </YStack>
  )
}

export const QuotesInfo: FC<{ data: FuturesDetail; onPress: () => void }> = ({
  data,
  onPress,
}) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [resolution, setResolution] = useState<string | number>(1)
  const TIMES = useMemo(() => {
    return [
      {
        label: t("trade.minute", { count: 1 }),
        value: 1,
      },
      {
        label: t("trade.minute", { count: 5 }),
        value: 5,
      },
      {
        label: t("trade.minute", { count: 15 }),
        value: 15,
      },
      {
        label: t("trade.minute", { count: 30 }),
        value: 30,
      },
      {
        label: t("trade.hour", { count: 1 }),
        value: 60,
      },
      {
        label: t("trade.day", { count: 1 }),
        value: "D",
      },
    ]
  }, [t])

  return (
    <YStack ov="hidden">
      <YStack ov="hidden">
        <FutureChartWidget
          futuresCode={data.futures?.futuresCode}
          volatility={data.futuresParam?.volatility}
          resolution={resolution}
          height={360}
        />
      </YStack>
      <YStack>
        <XStack p="$md" gap="$md">
          {TIMES.map((time) => (
            <XStack
              key={time.value}
              hitSlop={16}
              onPress={() => setResolution(time.value)}
            >
              <Text col={resolution === time.value ? "$primary" : "$secondary"}>
                {time.label}
              </Text>
            </XStack>
          ))}
          <XStack
            f={1}
            jc="flex-end"
            ai="center"
            onPress={() => {
              setVisible((v) => !v)
            }}
          >
            <Text>{t("trade.more")}</Text>
            <XStack rotate={visible ? "0deg" : "180deg"} hitSlop={16}>
              <Icon name="arrow" size={12} color={colors.text}></Icon>
            </XStack>
          </XStack>
        </XStack>
        <AnimatePresence>
          {visible && (
            <Moti from={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MoreInfo future={data} />
            </Moti>
          )}
        </AnimatePresence>
        <YStack bc={visible ? "transparent" : "$card"}>
          <MarketInfo future={data} onPress={onPress} />
        </YStack>
      </YStack>
    </YStack>
  )
}
