import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MarketInfo } from './market-info'

import { getFutureHistories } from '~/api/trade'
import { AnimatedFlow, Icon, Justified, Text, XStack, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useQuotesStore } from '~/hooks/useStore'
import { dayjs, formatDecimal } from '~/lib/utils'
import colors from '~/theme/colors'
import { FutureChartWidget } from '~/widgets/shared/future-chart-widget'

const PriceIndicator: FC<{
  min?: number
  max?: number
  value: number
  unit: string
  volatility?: number
}> = ({ min = 0, max = 0, value = 0, unit, volatility }) => {
  const percentage = ((value - min) / (max - min || 1)) * 100

  return (
    <Justified w="100%" gap="$sm">
      <Text f={1}>{`$${formatDecimal(min, volatility)}`}</Text>
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
        <XStack
          pos="absolute"
          t={0}
          b={0}
          w={3}
          bc="$primary"
          style={{
            left: `${percentage}%`,
            transform: [{ translateX: "-50%" }],
          }}
        />
      </XStack>
      <Text f={1} ta="right">{`$${formatDecimal(max, volatility)}`}</Text>
    </Justified>
  )
}

const MoreInfo: FC<{ future: FuturesDetail }> = ({ future }) => {
  const { t } = useTranslation()
  const quotes = useQuotesStore(
    (state) => state.quotes[future.futures?.futuresCode!]
  )
  const { data } = useRequest(
    () => {
      return getFutureHistories({
        symbol: future?.futures?.futuresCode!,
        resolution: 1,
        from: dayjs().subtract(1, "day").unix(),
        to: dayjs().unix(),
      }).then((res) => {
        const data = {
          minuteFive: {
            high: -Infinity,
            low: Infinity,
          },
          hour: {
            high: -Infinity,
            low: Infinity,
          },
          day: {
            high: -Infinity,
            low: Infinity,
          },
        }
        const minuteFiveLimit = dayjs().subtract(5, "minute").unix()
        const hourLimit = dayjs().subtract(1, "hour").unix()
        const dayLimit = dayjs().subtract(1, "day").unix()
        for (let i = res.length - 1; i >= 0; i--) {
          const item = res[i]
          if (item.time > minuteFiveLimit) {
            if (item.high > data.minuteFive.high) {
              data.minuteFive.high = item.high
            }
            if (item.low < data.minuteFive.low) {
              data.minuteFive.low = item.low
            }
          }
          if (item.time > hourLimit) {
            if (item.high > data.hour.high) {
              data.hour.high = item.high
            }
            if (item.low < data.hour.low) {
              data.hour.low = item.low
            }
          }
          if (item.time > dayLimit) {
            if (item.high > data.day.high) {
              data.day.high = item.high
            }
            if (item.low < data.day.low) {
              data.day.low = item.low
            }
          }
        }
        return data
      })
    },
    {
      ready: !!future?.futures?.futuresCode,
      refreshDeps: [future?.futures?.futuresCode],
    }
  )

  if (!future) {
    return null
  }
  const momentum =
    ((Number(quotes.Bid ?? future.market?.sellPrice ?? 0) -
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
                (((data?.minuteFive.high ?? 0) - (data?.minuteFive?.low ?? 0)) /
                  (data?.minuteFive?.low || 1)) *
                  100 || 0
              ).toFixed(2)}
              %
            </Text>
          </YStack>
          <YStack ai="center">
            <Text caption col="$secondary">
              {t("trade.hours", { count: 1 })}
            </Text>
            <Text>
              {(
                (((data?.hour?.high ?? 0) - (data?.hour?.low ?? 0)) /
                  (data?.hour?.low || 1)) *
                100
              ).toFixed(2)}
              %
            </Text>
          </YStack>
          <YStack ai="center">
            <Text caption col="$secondary">
              {t("trade.days", { count: 1 })}
            </Text>
            <Text>
              {(
                (((data?.day?.high ?? 0) - (data?.day?.low ?? 0)) /
                  (data?.day?.low || 1)) *
                100
              ).toFixed(2)}
              %
            </Text>
          </YStack>
        </XStack>
      </YStack>
      <YStack gap={12}>
        <Text heading>{t("trade.highLow")}</Text>
        <Text>
          {t("trade.currentSellPrice", {
            amount: formatDecimal(quotes.Bid ?? 0),
          })}
        </Text>
        <PriceIndicator
          min={data?.minuteFive?.low}
          max={data?.minuteFive?.high}
          value={parseFloat(future.market?.sellPrice ?? "0")}
          unit={t("trade.mins", { count: 5 })}
          volatility={future.futuresParam?.volatility}
        />
        <PriceIndicator
          min={data?.hour?.low}
          max={data?.hour?.high}
          value={parseFloat(future.market?.sellPrice ?? "0")}
          unit={t("trade.hours", { count: 1 })}
          volatility={future.futuresParam?.volatility}
        />
        <PriceIndicator
          min={data?.day?.low}
          max={data?.day?.high}
          value={parseFloat(future.market?.sellPrice ?? "0")}
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
        {visible && <MoreInfo future={data} />}
        <YStack bc={visible ? "transparent" : "$card"}>
          <MarketInfo future={data} onPress={onPress} />
        </YStack>
      </YStack>
    </YStack>
  )
}
