import { clearCache, useInterval } from "ahooks"
import _ from "lodash"
import { useCallback, useEffect, useRef } from "react"
import { createWithEqualityFn } from "zustand/traditional"

import { CACHE_KEY } from "./useRequest"
import { useForxlStore, useOrderStore, useQuotesStore } from "./useStore"

import { getOpenPositions, getPendingPositions } from "~/api/trade"
import { uuid, waitFor } from "~/lib/utils"

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

type FutureMessage =
  | {
      type: "pong"
      data: "1234"
    }
  | {
      type: "symbol"
      data: Quotes
    }
  | {
      type: "watchPositionChange"
      data: {
        posId: number
        futuresCode: string
        state: number
      }
    }

const WS_URL = "wss://ws.forxlmarkets.com/datafeed"

type WebSocketState = {
  quotes: string[]
}

const useWebSocketStore = createWithEqualityFn<WebSocketState>((set) => ({
  quotes: [],
}))

export const useWebSocket = () => {
  const { quotes } = useWebSocketStore()
  const websocketRef = useRef<WebSocket | null>(null)
  const lastMessageTimeRef = useRef<number>(Date.now())
  const sendMessage = useCallback(async (message: any) => {
    try {
      if (websocketRef.current?.readyState !== WebSocket.OPEN) {
        throw new Error("Websocket is not open")
      }
      websocketRef.current?.send(JSON.stringify(message))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
  }, [])
  const connect = useCallback(async () => {
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }
    websocketRef.current = new WebSocket(WS_URL)
    websocketRef.current.onopen = () => {
      if (quotes.length) {
        sendMessage({ type: "symbol", data: quotes })
      }
      sendMessage({
        type: "watchAccount",
        data: { userNumber: useForxlStore.getState().userNumber },
      })
    }

    websocketRef.current.onmessage = async (m) => {
      const message = JSON.parse(m?.data ?? "{}") as FutureMessage
      switch (message?.type) {
        case "symbol":
          useQuotesStore.getState().updateQuotes(message.data)
          break
        case "watchPositionChange":
          await waitFor(2000)
          // 刷新持仓和钱包信息
          getOpenPositions()
          // 如果是平仓或者撤销，刷新历史订单
          if (message.data.state > 0) {
            useOrderStore.setState({ reloadKey: uuid() })
          }
          // 如果是挂单操作，刷新挂单
          if (message.data.state >= 7) {
            getPendingPositions()
          }
          break
        case "pong":
          lastMessageTimeRef.current = Date.now()
      }
    }
  }, [quotes, sendMessage])

  const disconnect = useCallback(() => {
    websocketRef?.current?.close()
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  useEffect(() => {
    if (quotes.length) {
      sendMessage({ type: "symbol", data: quotes })
    }
  }, [quotes, sendMessage])

  useInterval(() => {
    if (websocketRef.current?.readyState === ReadyState.Open) {
      sendMessage({ type: "ping", data: "0" })
      return
    }
    const now = Date.now()
    if (
      now - lastMessageTimeRef.current > 60000 ||
      websocketRef.current?.readyState === WebSocket.CLOSED
    ) {
      lastMessageTimeRef.current = now
      connect()
    }
  }, 5000)
}

export const subscribeQuotes = (quotes: (string | undefined)[]) => {
  useWebSocketStore.setState({
    quotes: _.uniq([
      ...useWebSocketStore.getState().quotes,
      ...(quotes.filter((it) => !!it) as string[]),
    ]),
  })
}
