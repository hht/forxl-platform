import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { Platform } from "react-native"

import { toast } from "~/components"
import { BASE_URL, request } from "~/hooks/useRequest"
import { DepositResult, useFroxlStore } from "~/hooks/useStore"
import { i18n, t, toInfinite } from "~/lib/utils"

export const getPaymentMethods = async () => {
  return await request<PaymentMethod[], undefined>(
    "/other/v3/getInUsePayment",
    "POST"
  )
}

export const getWithdrawalMethods = async () => {
  return await request<WithdrawMethod[], undefined>(
    "/withdrawalChannel/support",
    "POST"
  )
}

export const getCountryCodes = async () => {
  return await request<CountryCode[], undefined>(
    "/other/v2/getCountryCodeList",
    "GET"
  )
}

export const getDefaultCountryCode = async () => {
  return await request<{ countryCode: string }, undefined>(
    "/other/getDefaultCountryCode",
    "GET"
  )
}

export const getWalletCategories = async () => {
  return await request<{ category: number; desc: string }[], undefined>(
    "/other/getWalletCategoryList",
    "POST"
  )
}

export const getFundHistory = async (params: {
  currentPage: number
  pageSize?: number
}) => {
  return await request<
    PaginationResponse<{
      id: number
      addTime: number
      recordId: number
      operationType: 9001 | 9002
      realAmount: number
      recordType: number
      selectAmount: number
      selectAmountUsdt: number
      spId: number
      status: number
      supMoney: number
      transferAmount: number
      transferCurrency: string
      transferRate: number
      updateTime: number
      refuseReason: string
      trc20Address: string
      feeValue: number
    }>,
    { currentPage: number; pageSize?: number }
  >("/pay/getUserDepositRecords", "POST", {
    currentPage: params?.currentPage ?? 1,
    pageSize: params?.pageSize ?? 10,
  }).then((res) => toInfinite(res, params.currentPage))
}

/**
 * 用户资金查询
 */

export const getAssets = async () => {
  return await request<
    {
      userWalletDetail: {
        userAsset: {
          userId: string
          totalAmount: string
          profit: string
          totalProfit: string
          updateTime: number
        }
        fundsAccount: {
          userId: string
          supMoney: string
          rebateMoney: string
          totalDeposit: string
          totalWithdrawals: string
          balance: string
          equity: string
          freeMargin: string
          futuresSupMoney: string
          totalMoney: string
          available: string
          profitLoss: string
          freezeMoney: string
          supFreezeMoney: string
          updateTime: number
        }
      }
    },
    { account?: number }
  >("/user/userWallet", "POST", {
    account: useFroxlStore.getState().account?.type ?? 0,
  })
}

export const getWalletStatement = async (params: {
  currentPage: number
  pageSize?: number
  stateCategory: number
  time: string
}) => {
  return await request<
    {
      list: {
        title: string
        type: number
        typeName: string
        id: number
        amount: number
        time: number
      }[]
      pageNum: number
      total: number
    },
    {
      currentPage: number
      pageSize: number
      stateCategory: number
      time: string
      language: string
    }
  >("/walletRecord/queryPage", "POST", {
    ...params,
    pageSize: params.pageSize ?? 10,
    language: i18n.language,
  })
    .then((res) => ({
      resultList: res.list,
      current: res.pageNum,
      pages: res.total,
    }))
    .then((res) => toInfinite(res, params.currentPage))
}

export const sendStatement = async (params: {
  months: string[]
  year: string
  lan: string
}) => {
  return request("/walletRecord/sendBill", "POST", {
    ...params,
    method: "email",
  })
}

export const deposit = async (params: {
  code: string
  amount: number
  type: 0 | 1 | 3 | 101 | 102
  paymentId?: number
}) => {
  switch (params.type) {
    case 0:
      return await request<
        { url: DepositResult },
        { istype: string; price: number }
      >("/pay/payToken", "POST", {
        istype: params.code,
        price: params.amount,
      }).then((res) => ({ ...res.url, payType: 0 as const }))
    case 1:
      return await request<
        { url: DepositResult },
        { istype: string; price: number }
      >("/pay/payBepToken", "POST", {
        istype: params.code,
        price: params.amount,
      }).then((res) => ({ ...res.url, payType: 1 as const }))
    case 3:
      return await request<
        DepositResult,
        {
          code: string
          usdAmount: number
          paymentId?: number
        }
      >("/pay/payByPayment", "POST", {
        code: params.code,
        usdAmount: params.amount,
        paymentId: params.paymentId,
      }).then((res) => ({ ...res, payType: 3 as const }))
    default:
      return undefined
  }
}

export const withdraw = async (params: {
  channelCode: string
  money: number
  recordType: number
  sign: string
  spId: string
  timestamp: number
  wdAccount: string
  emailCode: string
  gaCode: string
}) => {
  return await request("/pay/applyWithdrawMoney", "POST", params)
}

export const confirmDeposit = async (params: {
  orderNo: string
  payScreen: string
  payBank?: string
  payName?: string
  payAccount?: string
}) => {
  return await request("/pay/confirmGiantPay", "POST", params)
}

export const cancelDeposit = async (params: { orderNo: string }) => {
  return await request("/pay/cancelGiantPay", "POST", params)
}

export const upload = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== "granted") {
    toast.show(t("message.accessMedia"))
    return
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0,
  })

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const file = result.assets[0]

    const formData = new FormData()
    formData.append("user", "test")
    formData.append("file", {
      uri: !file.uri.startsWith("file") ? `file://${file.uri}` : file.uri,
      name: file.fileName || "photo.jpg",
      type:
        Platform.OS === "android" ? `image/jpeg` : file.type || "image/jpeg",
    } as any)
    try {
      const response = await axios.post(`${BASE_URL}/other/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return { src: response.data.data.src as string }
    } catch (error) {
      throw error
    }
  }
}

export const sendEmailCode = async () => {
  return request("/notice/sendWithdrawalVerifyCode", "POST", undefined).then(
    () => {
      toast.show(t("wallet.emailSent"))
    }
  )
}
