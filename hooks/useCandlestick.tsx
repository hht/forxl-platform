import dayjs from "dayjs"
import { useEffect } from "react"

import { useRequest } from "./useRequest"
import { useCandlestickStore, useQuotesStore } from "./useStore"

import { getFutureHistories } from "~/api/trade"

export const useCandlestick = (futuresCode?: string) => {
  useRequest(
    () => {
      return getFutureHistories({
        symbol: futuresCode!,
        resolution: 1,
        from: dayjs().subtract(1, "day").unix(),
        to: dayjs().unix(),
      }).then((res) => {
        const data = {
          minuteFive: {
            high: -Infinity,
            low: Infinity,
            time: 0,
          },
          hour: {
            high: -Infinity,
            low: Infinity,
            time: 0,
          },
          day: {
            high: -Infinity,
            low: Infinity,
            time: 0,
          },
        }

        // 获取最新时间戳
        const latestTime = Math.max(...res.map((item) => item.time))

        // 计算时间边界
        const currentMinuteFiveStart = Math.floor(latestTime / 300) * 300
        const currentHourStart = Math.floor(latestTime / 3600) * 3600
        const currentDayStart = Math.floor(latestTime / 86400) * 86400
        data.minuteFive.time = currentMinuteFiveStart
        data.hour.time = currentHourStart
        data.day.time = currentDayStart

        // 遍历数据
        res.forEach((item) => {
          // 5分钟K线
          if (item.time >= currentMinuteFiveStart) {
            data.minuteFive.high = Math.max(data.minuteFive.high, item.high)
            data.minuteFive.low = Math.min(data.minuteFive.low, item.low)
          }

          // 1小时K线
          if (item.time >= currentHourStart) {
            data.hour.high = Math.max(data.hour.high, item.high)
            data.hour.low = Math.min(data.hour.low, item.low)
          }

          // 1天K线
          if (item.time >= currentDayStart) {
            data.day.high = Math.max(data.day.high, item.high)
            data.day.low = Math.min(data.day.low, item.low)
          }
        })

        // 处理没有数据的情况
        if (data.minuteFive.high === -Infinity) {
          data.minuteFive.high = data.minuteFive.low = 0
        }
        if (data.hour.high === -Infinity) {
          data.hour.high = data.hour.low = 0
        }
        if (data.day.high === -Infinity) {
          data.day.high = data.day.low = 0
        }

        useCandlestickStore.setState(data)
      })
    },
    {
      ready: !!futuresCode,
      refreshDeps: [futuresCode],
    }
  )
  const quotes = useQuotesStore((state) => state.quotes[futuresCode ?? ""])
  useEffect(() => {
    if (quotes) {
      const current = useCandlestickStore.getState()
      const minuteFiveChanged = quotes.LastTime - current.minuteFive.time > 300
      const hourChanged = quotes.LastTime - current.hour.time > 3600
      const dayChanged = quotes.LastTime - current.day.time > 86400
      useCandlestickStore.setState({
        minuteFive: {
          time: minuteFiveChanged
            ? Math.floor(quotes.LastTime / 300) * 300
            : current.minuteFive.time,
          high: minuteFiveChanged
            ? quotes.High
            : Math.max(quotes.High, current.minuteFive.high),
          low: minuteFiveChanged
            ? quotes.Low
            : Math.min(quotes.Low, current.minuteFive.low),
          current: quotes.Bid,
        },
        hour: {
          time: hourChanged
            ? Math.floor(quotes.LastTime / 3600) * 3600
            : current.hour.time,
          high: hourChanged
            ? quotes.High
            : Math.max(quotes.High, current.hour.high),
          low: hourChanged
            ? quotes.Low
            : Math.min(quotes.Low, current.hour.low),
          current: quotes.Bid,
        },
        day: {
          time: dayChanged
            ? Math.floor(quotes.LastTime / 86400) * 86400
            : current.day.time,
          high: dayChanged
            ? quotes.High
            : Math.max(quotes.High, current.day.high),
          low: dayChanged ? quotes.Low : Math.min(quotes.Low, current.day.low),
          current: quotes.Bid,
        },
      })
    }
  }, [quotes])
}
