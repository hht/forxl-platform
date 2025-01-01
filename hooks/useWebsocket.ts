import { useInterval } from "ahooks"
import _ from "lodash"
import { useCallback, useEffect, useRef } from "react"
import { createWithEqualityFn } from "zustand/traditional"

import { useFroxlStore, useQuotesStore } from "./useStore"

import { getOpenPositions } from "~/api/trade"

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
  | { type: "watchPositionChange" }

const WS_URL = "wss://ws2.usd.lt/datafeed"

type WebSocketState = {
  quotes: string[]
}

const useWebSocketStore = createWithEqualityFn<WebSocketState>((set) => ({
  quotes: [],
}))

export const useWebSocket = () => {
  const { quotes } = useWebSocketStore()
  const messageQueue = useRef<any[]>([])
  const websocketRef = useRef<WebSocket | null>(null)
  const lastMessageTimeRef = useRef<number>(Date.now())
  const sendMessage = useCallback(async (message: any) => {
    try {
      if (websocketRef.current?.readyState !== WebSocket.OPEN) {
        throw new Error("Websocket is not open")
      }
      websocketRef.current?.send(JSON.stringify(message))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      messageQueue.current.push(message)
    }
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
        data: { userNumber: useFroxlStore.getState().userNumber },
      })
      while (messageQueue.current.length) {
        sendMessage(messageQueue.current.shift())
      }
    }

    websocketRef.current.onmessage = (m) => {
      const message = JSON.parse(m?.data ?? "{}") as FutureMessage
      switch (message?.type) {
        case "symbol":
          useQuotesStore.getState().updateQuotes(message.data)
          break
        case "watchPositionChange":
          getOpenPositions()
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
