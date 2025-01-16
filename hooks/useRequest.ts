import { useRequest as useRequestBase } from 'ahooks'
import { Options, Plugin, Service } from 'ahooks/lib/useRequest/src/types'
import axios from 'axios'

import { useFroxlStore } from './useStore'

import { toast } from '~/components'
import { i18n } from '~/lib/utils'

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
}

// @ts-ignore next-line
export const BASE_URL = "https://api2.usd.lt"

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
  body: U = {} as U
): Promise<T> => {
  return await axios
    .request<T, { data: Response<T> }>({
      url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
      method,
      headers: {
        "Access-Control-Allow-Origin": "*",
        language: i18n.resolvedLanguage,
      },
      ...(method === "GET"
        ? {
            params: {
              ...body,
              userNumber: useFroxlStore.getState().userNumber,
            },
          }
        : {
            data: { ...body, userNumber: useFroxlStore.getState().userNumber },
          }),
    })
    .then((res) => res.data)
    .then((res) => {
      if (typeof res === "object" && res !== null && "code" in res) {
        if (res.code === 502) {
          useFroxlStore.setState({ userNumber: "" })
          throw new Error(res.msg)
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
      console.log("🚀", url)
      console.log("👜", JSON.stringify(body))
      console.log("🚫", JSON.stringify(error.message ?? error))
      throw error.message
    })
}

export const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>,
  plugins?: Plugin<TData, TParams>[]
) =>
  useRequestBase(
    service,
    {
      onError: (error) => {
        console.log("发生错误：", error)
        toast.show(error.message ?? error)
      },
      ...options,
    },
    plugins
  )
