import { useInterval } from "ahooks"
import _ from "lodash"
import { useCallback, useEffect, useRef } from "react"
import { createWithEqualityFn } from "zustand/traditional"

import {
  computeProfit,
  useForxlStore,
  useOrderStore,
  useQuotesStore,
} from "./useStore"

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
      data: string
    }

const WS_URL = "wss://ws.forxlmarkets.com/datafeed"

type WebSocketState = {
  quotes: string[]
}

const useWebSocketStore = createWithEqualityFn<WebSocketState>((set) => ({
  quotes: [],
}))

const computeWallet = (order?: Position) => {
  if (!order) return
  const profit = Number(computeProfit(order).toFixed(2))
  useOrderStore.setState({
    wallet: {
      ...useOrderStore.getState().wallet,
      totalMoney:
        Number(useOrderStore.getState().wallet?.totalMoney ?? 0) + profit,
      available:
        Number(useOrderStore.getState().wallet?.available ?? 0) + profit,
      supMoney: Number(useOrderStore.getState().wallet?.supMoney!) + profit,
      freezeMoney:
        Number(useOrderStore.getState().wallet?.freezeMoney ?? 0) -
        (order.securityDeposit ?? 0),
      supFreezeMoney:
        Number(useOrderStore.getState().wallet?.supFreezeMoney!) +
        (order.securityDeposit ?? 0) +
        profit,
    },
    orders: useOrderStore.getState().orders?.filter((it) => it.id !== order.id),
    pendingOrders: useOrderStore
      .getState()
      .pendingOrders?.filter((it) => it.id !== order.id),
  })
  useOrderStore.setState({ reloadKey: uuid() })
}

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
          const data = JSON.parse(message?.data ?? "{}") as {
            posId: number
            state: number
          }
          await waitFor(2000)
          switch (data.state) {
            case 0:
              getOpenPositions()
              break
            case 7:
              getPendingPositions()
              break
            case 8:
              useOrderStore.setState({
                pendingOrders: useOrderStore
                  .getState()
                  .pendingOrders?.filter((it) => it.id !== data.posId),
              })
              break
            case 9:
              const pendingOrder = useOrderStore
                .getState()
                .pendingOrders?.find((it) => it.id === data.posId)
              computeWallet(pendingOrder)
              break
            default:
              const order = useOrderStore
                .getState()
                .orders?.find((it) => it.id === data.posId)
              computeWallet(order)
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
