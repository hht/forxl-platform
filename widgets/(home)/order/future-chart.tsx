import { FC, useEffect } from 'react'
import { useWebViewMessage } from 'react-native-react-bridge'
import WebView from 'react-native-webview'
import { shallow } from 'zustand/shallow'

import { useQuotesStore } from '~/hooks/useStore'
import { DEVICE_WIDTH } from '~/lib/utils'
import colors from '~/theme/colors'
import ChartHTML from '~/widgets/shared/future-chart'

export const FutureChart: FC<{
  data: FuturesDetail

  resolution?: number | string
}> = ({ data, resolution }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futures?.futuresCode!],
    shallow
  )
  const { ref, onMessage, emit } = useWebViewMessage((message) => {
    if (message.type === "Future") {
      emit({
        type: "Future",
        data: {
          symbol: data.futures?.futuresCode!,
          volatility: data.futuresParam?.volatility,
          resolution: resolution ?? 1,
        },
      })
    }
    // 收到了消息
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
    if (data.futures?.futuresCode && data.futuresParam?.volatility) {
      emit({
        type: "Future",
        data: {
          symbol: data.futures?.futuresCode!,
          volatility: data.futuresParam?.volatility,
          resolution: resolution ?? 1,
        },
      })
    }
  }, [
    resolution,
    emit,
    data.futures?.futuresCode,
    data.futuresParam?.volatility,
  ])
  return (
    <WebView
      // ref, source and onMessage must be passed to react-native-webview
      ref={ref}
      style={{
        width: DEVICE_WIDTH - 2,
        height: 400,
        backgroundColor: colors.background,
      }}
      // Pass the source code of React app
      source={{ html: ChartHTML }}
      onMessage={onMessage}
    />
  )
}
