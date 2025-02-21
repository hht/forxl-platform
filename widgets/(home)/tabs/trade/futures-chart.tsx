import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import { AnimatePresence } from 'moti'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import { Icon, Moti, Text, XStack } from '~/components'
import { useQuotesStore, useSymbolStore } from '~/hooks/useStore'
import colors from '~/theme/colors'
import { FutureChartWidget } from '~/widgets/shared/future-chart-widget'

export const FuturesChart: FC = () => {
  const currentSymbol = useSymbolStore((state) => state.currentSymbol, shallow)
  const currentCode = useQuotesStore(
    (state) => state.currentFuture?.futuresShow,
    shallow
  )
  const isFocused = useIsFocused()
  const [resolution, setResolution] = useState<string | number>(1)
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
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
  useEffect(() => {
    if (!isFocused) {
      useSymbolStore.setState({ currentSymbol: undefined })
    }
  }, [isFocused])

  return (
    <AnimatePresence>
      {currentSymbol && (
        <Moti
          key="bar"
          from={{
            translateY: 400,
          }}
          animate={{
            translateY: 0,
          }}
          exit={{
            translateY: 400,
          }}
          transition={{
            type: "timing",
          }}
          style={[style.container, { paddingBottom: bottom + 16 }]}
        >
          <XStack
            p="$md"
            bc="$background"
            btc="$border"
            btw={1}
            ai="center"
            gap="$md"
          >
            <Text>{`${currentCode ?? currentSymbol} ${t("trade.chart")}`}</Text>
            <XStack f={1} />
            <XStack
              rotate="90deg"
              hitSlop={16}
              onPress={() => {
                useSymbolStore.setState({ currentSymbol: undefined })
              }}
            >
              <Icon name="chevronRight" size={16}></Icon>
            </XStack>
          </XStack>
          <XStack
            p="$md"
            bc="$background"
            btc="$border"
            btw={1}
            ai="center"
            gap="$md"
          >
            {TIMES.map((time) => (
              <XStack
                key={time.value}
                hitSlop={16}
                onPress={() => setResolution(time.value)}
              >
                <Text
                  col={resolution === time.value ? "$primary" : "$secondary"}
                >
                  {time.label}
                </Text>
              </XStack>
            ))}
            <XStack f={1} />
            <XStack
              rotate="135deg"
              hitSlop={16}
              onPress={() => {
                useSymbolStore.setState({ currentSymbol: undefined })
                const data = useQuotesStore.getState().currentFuture
                if (!data) {
                  return
                }
                const diff =
                  ((data.volatility ?? 0) * (data.clazzSpread ?? 0)) / 2

                const price =
                  (useQuotesStore.getState().quotes[data.futuresCode!]?.Bid ??
                    data.sellPrice) - diff
                useQuotesStore.setState({
                  activeIndex: 1,
                  currentFuture: data,
                  action: "buy",
                  order: { position: 0.01, price },
                })
                router.push("/order")
              }}
            >
              <Icon name="arrowLeft" color={colors.primary} size={20} />
            </XStack>
          </XStack>
          {currentSymbol && (
            <FutureChartWidget
              futuresCode={currentSymbol.symbol}
              volatility={currentSymbol.volatility}
              resolution={resolution}
              height={260}
            />
          )}
        </Moti>
      )}
    </AnimatePresence>
  )
}

const style = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
})
