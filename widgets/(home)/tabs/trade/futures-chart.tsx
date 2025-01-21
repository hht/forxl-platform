import { AnimatePresence } from "moti"
import { FC, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import { shallow } from "zustand/shallow"

import { Icon, Moti, Text, XStack } from "~/components"
import { useSymbolStore } from "~/hooks/useStore"
import { FutureChartWidget } from "~/widgets/shared/future-chart-widget"

export const FuturesChart: FC = () => {
  const currentSymbol = useSymbolStore((state) => state.currentSymbol, shallow)
  const [visible, setVisible] = useState(false)
  const [resolution, setResolution] = useState<string | number>(1)
  const { t } = useTranslation()
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
    if (!currentSymbol) {
      setVisible(false)
    }
  }, [currentSymbol])
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
          style={style.container}
        >
          <XStack
            p="$md"
            bc="$background"
            btc="$border"
            btw={1}
            ai="center"
            gap="$md"
          >
            <Text>{`${currentSymbol.symbol} ${t("trade.chart")}`}</Text>
            <XStack f={1} />
            <XStack
              rotate={visible ? "90deg" : "270deg"}
              hitSlop={16}
              onPress={() => {
                setVisible((v) => !visible)
              }}
            >
              <Icon name="chevronRight" size={16}></Icon>
            </XStack>
          </XStack>
          {visible ? (
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
            </XStack>
          ) : null}
          {currentSymbol && visible && (
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
  },
})
