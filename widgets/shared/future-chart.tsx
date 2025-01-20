"use dom"
import axios from "axios"
import dayjs from "dayjs"
import {
  ColorType,
  createChart,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import {
  emit,
  useNativeMessage,
  webViewRender,
} from "react-native-react-bridge/lib/web"

import "./webview.css"

const getFutureHistories = async (params: {
  symbol: string
  resolution: string | number
  to?: number
}) => {
  const to = params.to ?? dayjs().unix()
  const from =
    to -
    200 * (_.isString(params.resolution) ? 24 * 60 : params.resolution) * 60
  emit({
    type: "params",
    data: {
      symbol: params.symbol,
      resolution: params.resolution,
      from,
      to,
    },
  })
  return await axios
    .request({
      url: `https://api2.usd.lt/global/history`,
      method: "GET",
      params: {
        symbol: params.symbol,
        resolution: params.resolution,
        from,
        to,
      },
    })
    .then((res) => {
      emit({
        type: "axios",
        data: "",
      })
      return res.data.data
    })
    .then(
      ({
        c,
        h,
        l,
        o,
        t,
      }: {
        c: number[]
        h: number[]
        l: number[]
        o: number[]
        t: number[]
      }) => {
        if (!c) {
          return []
        }
        return c.map((it, index) => ({
          high: h![index],
          low: l![index],
          open: o![index],
          close: it,
          time: t![index],
        }))
      }
    )
}

export const getDate = (date?: dayjs.ConfigType) => {
  return dayjs(date).utcOffset(0)
}

const Root = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [params, setParams] = useState<
    | {
        symbol: string
        volatility: number
        resolution: string | number
      }
    | undefined
  >(undefined)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const loadingRef = useRef(false)
  const fetchedRef = useRef(false)
  // useNativeMessage hook receives message from React Native
  useNativeMessage((message: any) => {
    if (message.type === "Future") {
      setParams(message.data)
      return
    }
    if (message.type === "Quotes") {
      const quotes = message.data
      if (quotes && seriesRef.current && seriesRef.current.data().length) {
        const current = seriesRef.current.dataByIndex(
          seriesRef.current.data().length - 1
        )
        if (
          current &&
          quotes.LastTime - (current.time as number) <
            (_.isString(params?.resolution)
              ? 24 * 60
              : (params?.resolution ?? 1)) *
              60
        ) {
          const previous = current as {
            time: number
            open: number
            high: number
            low: number
            close: number
          }
          seriesRef.current?.update({
            time: current.time as UTCTimestamp,
            open: previous.open,
            high: Math.max(quotes.High, previous.high),
            low: Math.min(quotes.Low, previous.low),
            close: quotes.Bid,
          })
        } else {
          seriesRef.current?.update({
            time: quotes.LastTime as UTCTimestamp,
            open: quotes.Bid,
            high: quotes.High,
            low: quotes.Low,
            close: quotes.Bid,
          })
        }
      }
    }
  })
  useEffect(() => {
    if (!params) {
      emit({
        type: "Future",
        data: "",
      })
      return
    }
    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: "black" },
        textColor: "white",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#30363A66" },
        horzLines: { color: "#30363A66" },
      },
      width: window.innerWidth,
      height: window.innerHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: params?.resolution === 1 || params?.resolution === 5,
        tickMarkFormatter: (time: UTCTimestamp) => {
          return _.isString(params?.resolution)
            ? dayjs(time * 1000).format("YY-MM-DD")
            : dayjs(time * 1000).format("HH:mm")
        },
      },

      localization: {
        timeFormatter: (time: UTCTimestamp) => {
          return _.isString(params?.resolution)
            ? dayjs(time * 1000).format("YY-MM-DD")
            : getDate(time * 1000).format("YY-MM-DD HH:mm")
        },
      },
    })
    const precision = params?.volatility?.toString().split(".")[1]?.length ?? 2
    const minMove = params?.volatility ?? 0.01
    const series = chart.addCandlestickSeries({
      upColor: "#10F48A",
      downColor: "#F66754",
      borderVisible: false,
      wickUpColor: "#10F48A",
      wickDownColor: "#F66754",
      priceFormat: {
        type: "price",
        precision,
        minMove,
      },
    })
    seriesRef.current = series
    fetchedRef.current = false
    loadingRef.current = true

    getFutureHistories({
      symbol: params?.symbol,
      resolution: params?.resolution ?? 1,
    })
      .then((data) => {
        if (data.length <= 2) {
          fetchedRef.current = true
        }
        series.setData(data as any)
      })
      .finally(() => {
        loadingRef.current = false
      })
    emit({
      type: "debug",
      data: "5",
    })
    chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
      if (logicalRange && logicalRange.from < 10) {
        const last = seriesRef.current?.data()[0]
        if (
          last &&
          loadingRef.current === false &&
          fetchedRef.current === false
        ) {
          loadingRef.current = true
          getFutureHistories({
            symbol: params.symbol,
            resolution: params?.resolution,
            to: last.time as number,
          })
            .then((data) => {
              if (data.length <= 2) {
                fetchedRef.current = true
              }
              series.setData([
                ...(data.filter(
                  (it) => (it.time as number) < (last.time as number)
                ) as any),
                ...seriesRef.current!.data(),
              ])
            })
            .finally(() => {
              loadingRef.current = false
            })
        }
      }
    })
    return () => {
      chart.remove()
    }
  }, [params])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        display: "flex",
      }}
    >
      <div
        ref={chartContainerRef}
        style={{ width: "100%", height: "100%", backgroundColor: "black" }}
      />
    </div>
  )
}

export default webViewRender(<Root />)
