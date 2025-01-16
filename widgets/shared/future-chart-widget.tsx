import { FC, useEffect } from 'react'
import { useWebViewMessage } from 'react-native-react-bridge'
import WebView from 'react-native-webview'
import { shallow } from 'zustand/shallow'

import { useQuotesStore } from '~/hooks/useStore'
import { DEVICE_WIDTH } from '~/lib/utils'
import colors from '~/theme/colors'
import ChartHTML from '~/widgets/shared/future-chart'

export const FutureChartWidget: FC<{
  futuresCode?: string
  volatility?: number
  resolution?: number | string
  height: number
}> = ({ futuresCode, volatility, resolution, height }) => {
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
    <WebView
      ref={ref}
      style={{
        width: DEVICE_WIDTH - 2,
        height,
        backgroundColor: colors.background,
      }}
      source={{ html: ChartHTML }}
      onMessage={onMessage}
      androidLayerType="hardware"
    />
  )
}
