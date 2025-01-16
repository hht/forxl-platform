import axios from 'axios'
import _ from 'lodash'

import { getDate } from '~/hooks/useLocale'
import { BASE_URL, request } from '~/hooks/useRequest'
import { useFroxlStore, useOrderStore, useQuotesStore } from '~/hooks/useStore'
import { dayjs, i18n, toInfinite, waitFor } from '~/lib/utils'

export const getFutures = async (params: GetFuturesParams) => {
  return await request<PaginationResponse<Future>, GetFuturesParams>(
    "/futures/futuresList",
    "POST",
    params
  )
    .then((res) => {
      if (!useQuotesStore.getState().currentFuture) {
        useQuotesStore.setState({
          currentFuture: res.resultList?.filter((it) => it.isDeal)?.[0],
        })
      }
      return res
    })
    .catch(() => {
      return {
        num: 0,
        resultList: [] as Future[],
        pages: params.currentPage,
      }
    })
    .then((res) => {
      return toInfinite(res, params.currentPage)
    })
}

export const getFuture = async (code: string) => {
  return await request<FuturesDetail, { futuresCode: string }>(
    "/futures/detailByFuturesCode",
    "POST",
    {
      futuresCode: code,
    }
  )
}

const updateOrderStore = (positions: Position[]) => {
  const currentPosition = positions.find(
    (it) => it.id === useOrderStore.getState().currentPosition?.id
  )
  if (currentPosition) {
    useOrderStore.setState({ currentPosition })
  }
  if (currentPosition) {
    return true
  }
  return false
}

export const getPendingPositions = async (currentPage = 1) => {
  return await request<
    {
      pendingAllNum: number
      pendingPositionList: Position[]
    } | null,
    undefined
  >("/order/v2/pendingPositionList", "POST")
    .then((res) => ({
      num: res?.pendingAllNum ?? 0,
      resultList: res?.pendingPositionList ?? [],
      pages: 1,
    }))
    .then((res) => {
      useOrderStore.setState({
        pendingOrders: res?.resultList ?? [],
      })
      updateOrderStore(res?.resultList ?? [])
      return res?.resultList ?? []
    })
    .catch((e) => {
      return [] as Position[]
    })
}

export const getOpenPositions = async (currentPage = 1) => {
  return await request<
    {
      onwAllNum: number
      onwPositionList: Position[]
      followAllNum: number
      followPositionList: Position[]
      wallet: Wallet["forexAccount"]
    } | null,
    undefined
  >("/order/v2/pageData", "POST")
    .then((res) => {
      useOrderStore.setState({
        wallet: res?.wallet,
        orders: res?.onwPositionList ?? [],
      })
      updateOrderStore(res?.onwPositionList ?? [])
      return res?.onwPositionList ?? []
    })
    .catch((e) => {
      return [] as Position[]
    })
}

export const getClosedPositions = async ({
  currentPage = 1,
  startTime,
  endTime,
}: {
  currentPage?: number
  startTime?: number
  endTime?: number
}) => {
  return await request<
    | (PaginationResponse<Position> & {
        contratprofits: string
      })
    | null,
    {
      currentPage: number
      pageSize: number
      startTime?: number
      endTime?: number
    }
  >("/order/historyList", "POST", {
    currentPage,
    pageSize: 10,
    startTime,
    endTime,
  })
    .then((res) => ({
      num: res?.allNum ?? 0,
      resultList: res?.resultList ?? [],
      pages: res?.pages ?? 1,
      profit: res?.contratprofits,
    }))
    .catch((e) => {
      return {
        num: 0,
        resultList: [],
        pages: currentPage,
        profit: 0,
      }
    })
    .then((res) => {
      const found = updateOrderStore(res.resultList)
      useOrderStore.setState({
        totalProfit: Number(res.profit),
        activeIndex: found ? 2 : useOrderStore.getState().activeIndex,
      })
      return toInfinite<Position>(res, currentPage)
    })
}

export const exportClosedPositions = async ({
  startTime,
  endTime,
}: {
  startTime?: number
  endTime?: number
}) => {
  return await axios
    .post(
      BASE_URL + "/order/historyList/export",
      {
        startTime,
        endTime,
        userNumber: useFroxlStore.getState().userNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          language: i18n.resolvedLanguage,
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      }
    )
    .then((res) => res.data)
}

export const proceedOrder = async (params: OrderParams) => {
  const response = await request("/order/userNewOrder", "POST", params)
  if (params.byOrSell === 7 && useOrderStore.getState().activeIndex === 1) {
    waitFor(500).then(() => getPendingPositions())
  } else {
    waitFor(500).then(() => getOpenPositions())
  }
  return response
}

export const cancelOrder = async (params: {
  positionsId: number
  cancelPrice: number
}) => {
  const response = await request("/order/cancelPending", "POST", params)
  waitFor(500).then(() => getPendingPositions())
  return response
}

export const updateOrder = async (params: {
  orderId: number
  stopLossPrice: number
  stopProfitPrice: number
}) => {
  const response = await request("/order/updateLimitPrice", "POST", params)
  if (useOrderStore.getState().activeIndex === 1) {
    waitFor(500).then(() => getPendingPositions())
  }
  if (useOrderStore.getState().activeIndex === 0) {
    waitFor(500).then(() => getOpenPositions())
  }
  return response
}

export const getFutureCategories = async () => {
  return await request<
    {
      name: string
      type: GetFuturesParams["type"]
      isSelect: 1 | 0
      isBest: 0 | 0
      selectCount: number
      futuresCount: number
    }[],
    undefined
  >("/futures/typeList", "POST")
}

export const getFutureHistories = async (params: {
  symbol: string
  resolution: string | number
  from?: number
  to?: number
}) => {
  const to = params.to ?? dayjs().unix()
  const from =
    params.from ??
    to -
      200 * (_.isString(params.resolution) ? 24 * 60 : params.resolution) * 60
  return await request<
    {
      c: number[] | null
      h: number[] | null
      l: number[] | null
      o: number[] | null
      t: number[] | null
    },
    { symbol: string; resolution: string | number; from: number; to: number }
  >(`/global/history`, "GET", {
    symbol: params.symbol,
    resolution: params.resolution,
    from,
    to,
  }).then(({ c, h, l, o, t }) => {
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
  })
}

export const toggleFavorite = async (params: {
  futuresId: number
  selected: 0 | 1
}) => {
  if (params.selected === 1) {
    return await request("/futures/deleteSelect", "POST", params)
  } else {
    return await request("/futures/addSelect", "POST", params)
  }
}

export const getExploreHistories = async () => {
  return await request<Future[] | null, undefined>(
    "/futures/searchHistoryList",
    "POST"
  )
    .then((res) => res ?? [])
    .then((res) => {
      useFroxlStore.setState({
        histories: res,
      })
    })
}

export const updateExploreHistories = async (futuresId: string[]) => {
  return await request("/futures/searchHistoryUpdate", "POST", {
    futuresIds: futuresId.join(","),
  }).then(getExploreHistories)
}
