import { useRequest as useRequestBase, useUnmount } from 'ahooks'
import { Options, Plugin, Service } from 'ahooks/lib/useRequest/src/types'
import axios from 'axios'
import React from 'react'

import { toast } from '~/components'
import { BASE_URL } from '~/lib/constants'
import { i18n } from '~/lib/utils'

import { useForxlStore } from './useStore'

export const CACHE_KEY = {
  USER: "/user/getUser",
  ATTESTATION: "/user/getAttestationFlag",
  IN_USE_PAYMENT: "/other/v3/getInUsePayment",
  IN_USE_WITHDRAW: "/other/v3/support",
  ORDER_ANALYSIS: "/account/getOrderAnalysis/",
  ASSETS: "/user/assetQuery",
  POSITIONS: "/order/v2/pageData",
  PENDING: "/order/v2/pendingPositionList",
  FUTURE: "/futures/detailByFuturesCode",
  FUTURE_CATEGORIES: "/futures/typeList",
  CACHE_SIZE: "/other/v3/getCacheSize",
  GOOGLE_AUTH: "/user/getGoogleAuth",
  HISTORIES: "/order/v2/historyPositionList",
  PARTNER: "/partner/getPartnerInfo",
  TRADE_MESSAGES: "/message/v2/pageData",
  SYSTEM_MESSAGES: "/message/v2/systemPageData",
  BANNERS: "/banner/v3/list",
  REFERRALS: "/user/getReferral",
}


type Response<T> =
  | {
    code?: number
    msg?: string
    data?: T
  }
  | T

export const request = async <T, U>(
  url: string,
  method: string,
  body: U = {} as U,
  signal?: AbortSignal
): Promise<T> => {
  return await axios
    .request<T, { data: Response<T> }>({
      url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
      method,
      signal,
      headers: {
        language: i18n.resolvedLanguage,
      },
      ...(method === "GET"
        ? {
          params: {
            ...body,
            userNumber: useForxlStore.getState().userNumber,
          },
        }
        : {
          data: { ...body, userNumber: useForxlStore.getState().userNumber },
        }),
    })
    .then((res) => res.data)
    .then((res) => {
      if (typeof res === "object" && res !== null && "code" in res) {
        if (res.code === 502) {
          useForxlStore.setState({ userNumber: "" })
          throw new Error(res.msg)
        }
        if (res.code === 1502) {
          return { ...res.data, code: 1502 } as T
        }
        if (res.code !== 100) {
          throw new Error(res.msg)
        } else {
          // console.log("🚀", url)
          // console.log("👜", JSON.stringify(body))
          // console.log("✅", JSON.stringify(res))
          return res.data as T
        }
      }
      // console.log("🚀", url)
      // console.log("👜", JSON.stringify(body))
      // console.log("✅", JSON.stringify(res))
      return res as T
    })
    .catch((error) => {
      // console.log("🚀", url)
      // console.log("👜", JSON.stringify(body))
      // console.log("🚫", JSON.stringify(error.message ?? error))
      throw error.message
    })
}

export const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams> & {
    autoAbort?: boolean
  },
  plugins?: Plugin<TData, TParams>[]
) => {
  const abortController = React.useRef<AbortController | null>(null)

  useUnmount(() => {
    if (options?.autoAbort) {
      abortController.current?.abort()
    }
  })

  const wrappedService: Service<TData, TParams> = async (...args: TParams) => {
    abortController.current?.abort()
    abortController.current = new AbortController()

    // abortController.current.signal.addEventListener('abort', () => {
    //   console.log('请求已被取消 - Signal aborted')
    // })

    if (typeof service === 'function') {
      if (service.name === 'request') {
        const serviceFunc = service as any
        return serviceFunc(...args, abortController.current.signal)
      }
      return service(...args)
    }
    return service
  }

  return useRequestBase(
    wrappedService,
    {
      onError: (error) => {
        if (error.name === 'AbortError') {
          return
        }
        toast.show(error.message ?? error)
      },
      ...options,
    },
    plugins
  )
}
