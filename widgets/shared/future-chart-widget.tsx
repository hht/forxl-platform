import { FC, Fragment, useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { useWebViewMessage } from "react-native-react-bridge"
import WebView from "react-native-webview"
import { YStack } from "tamagui"
import { shallow } from "zustand/shallow"

import { useQuotesStore } from "~/hooks/useStore"
import { DEVICE_WIDTH } from "~/lib/utils"
import colors from "~/theme/colors"
import ChartHTML from "~/widgets/shared/future-chart"

export const FutureChartWidget: FC<{
  futuresCode?: string
  volatility?: number
  resolution?: number | string
  height: number
}> = ({ futuresCode, volatility, resolution, height }) => {
  const [loaded, setLoaded] = useState(false)
  const quotes = useQuotesStore((state) => state.quotes[futuresCode!], shallow)
  const { ref, onMessage, emit } = useWebViewMessage((message) => {
    if (message.type === "Future") {
      emit({
        type: "Future",
        data: {
          symbol: futuresCode!,
          volatility: volatility,
          resolution: resolution ?? 1,
        },
      })
    }
  })
  useEffect(() => {
    if (quotes) {
      emit({
        type: "Quotes",
        data: quotes,
      })
    }
  }, [quotes, emit])
  useEffect(() => {
    if (futuresCode && volatility) {
      emit({
        type: "Future",
        data: {
          symbol: futuresCode!,
          volatility: volatility,
          resolution: resolution ?? 1,
        },
      })
    }
  }, [resolution, emit, futuresCode, volatility])
  return (
    <YStack h={height} w={DEVICE_WIDTH - 2}>
      <WebView
        ref={ref}
        style={{
          width: DEVICE_WIDTH - 2,
          height,
          backgroundColor: colors.background,
        }}
        containerStyle={{
          backgroundColor: colors.background,
        }}
        source={{ html: ChartHTML }}
        onLoadEnd={() => {
          setLoaded(true)
        }}
        onMessage={onMessage}
        androidLayerType="hardware"
      />
      {!loaded && (
        <YStack
          h={height}
          pos="absolute"
          l={0}
          r={0}
          t={0}
          bc="$background"
          ai="center"
          jc="center"
        >
          <ActivityIndicator />
        </YStack>
      )}
    </YStack>
  )
}
