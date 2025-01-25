import AsyncStorage from "@react-native-async-storage/async-storage"
import { produce } from "immer"
import { createJSONStorage, persist } from "zustand/middleware"
import { createWithEqualityFn } from "zustand/traditional"

import { getPartnerConfig } from "~/api/partner"
import { getFutureCategories } from "~/api/trade"
import { dayjs, i18n } from "~/lib/utils"

interface Store {
  account?: Account
  userNumber?: string
  timezone: number
  language: string
  histories?: Future[]
  realName?: Certification
}

export const useForxlStore = createWithEqualityFn<Store>()(
  persist(
    (set) => ({
      timezone: dayjs().utcOffset(),
      language: "en",
    }),
    {
      name: "forxl",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useKYCStore = createWithEqualityFn<{
  refreshKey?: string
}>(() => ({}))

export const useWebViewStore = createWithEqualityFn<{
  title?: string
  uri?: string
  html?: string
}>(() => ({}))
interface Order {
  position?: number
  price?: number
  openSafe?: number
  stopLossPrice?: number
  stopProfitPrice?: number
}
interface QuotesStore {
  quotes: Record<
    string,
    Quotes & {
      AskDiff: number
      BidDiff: number
      LastUpdated: number
    }
  >
  futures: Record<string, FuturesDetail>
  currentFuture?: Future
  activeIndex: number
  action: "buy" | "sell"
  order?: Partial<Order>
  updateQuotes: (quotes: Quotes) => void
  updateOrder: (data: Partial<Order>) => void
  cancelOrder: () => void
  enablePending?: boolean
  enableCloseProfit?: boolean
  enableCloseLoss?: boolean
  currentFutureDetail?: FuturesDetail
  getCurrentPrice: (c?: "buy" | "sell") => number
  getOrderPrice: (ratio: number) => number
}

export const useQuotesStore = createWithEqualityFn<QuotesStore>((set, get) => ({
  action: "buy" as const,
  activeIndex: 0,
  quotes: {},
  futures: {},
  order: {
    position: 0.01,
  },
  getCurrentPrice: (c?: "buy" | "sell") => {
    const { currentFuture, action, quotes } = get()
    const currentQuote = quotes[currentFuture?.futuresShow!]
    return getCurrentFuturePrice({
      futureCode: currentFuture?.futuresShow!,
      action: c ?? action,
      volatility: currentFuture?.volatility,
      clazzSpread: currentFuture?.clazzSpread,
      buyPrice: currentFuture?.buyPrice,
      sellPrice: currentFuture?.sellPrice,
      Ask: currentQuote?.Ask,
      Bid: currentQuote?.Bid,
    })
  },
  getOrderPrice: (ratio) => {
    const { order, action, currentFuture, enablePending } = get()
    const price = enablePending ? (order?.price ?? 0) : get().getCurrentPrice()
    const localRatio = action === "buy" ? 1 : -1
    const finalDiff =
      (currentFuture?.volatility ?? 0) * 100 * ratio * localRatio
    return Math.max(price + finalDiff, 0)
  },
  updateQuotes: (quotes) =>
    set(
      produce((state: QuotesStore) => {
        const previous = get().quotes[quotes.Symbol]
        const LastUpdated = Date.now()
        if (LastUpdated - previous?.LastUpdated < 500) {
          return
        }

        state.quotes[quotes.Symbol] = {
          ...quotes,
          LastUpdated: Date.now(),
          AskDiff: quotes.Ask - (previous?.Ask ?? quotes.Ask),
          BidDiff: quotes.Bid - (previous?.Bid ?? quotes.Bid),
        }
      })
    ),
  updateOrder: (data) => {
    set(
      produce((state: QuotesStore) => {
        state.order = { ...state.order, ...data }
      })
    )
  },
  cancelOrder: () => {
    set(
      produce((state: QuotesStore) => {
        state.order = undefined
      })
    )
  },
}))

export const OPTIONS = [
  "today",
  "lastWeek",
  "lastMonth",
  "last3Months",
  "last6Months",
  "lastYear",
  "customPeriod",
] as const

export const useOrderStore = createWithEqualityFn<{
  activeIndex: 0 | 1 | 2
  options?: (typeof OPTIONS)[number]
  from?: number
  to?: number
  currentPosition?: Position
  willClosePosition?: Position
  pendingOrders?: Position[]
  totalProfit?: number
  orders?: Position[]
  reloadKey?: string
  wallet?: Wallet["forexAccount"]
}>((set) => ({
  activeIndex: 0,
  options: undefined,
}))

export const useStatisticsStore = createWithEqualityFn<{
  totalMoney: number
  available: number
  freezeMoney: number
  supFreezeMoney: number
  profit: number
}>()((set) => ({
  totalMoney: 0,
  available: 0,
  freezeMoney: 0,
  supFreezeMoney: 0,
  profit: 0,
}))

export const useSymbolStore = createWithEqualityFn<{
  codeOrName: string
  currentFuture?: Awaited<ReturnType<typeof getFutureCategories>>[number]
  currentSymbol?: {
    symbol: string
    volatility: number
  }
  mutationFuture?: {
    futuresId: number
    selected: 0 | 1
  }
}>((set) => ({
  codeOrName: "",
}))

export const usePromptStore = createWithEqualityFn<{
  reloadKey?: string
  title?: string
  desc?: string | string[]
}>(() => ({}))

export const usePartnerStore = createWithEqualityFn<{
  activeIndex: number
  partnerLevel: number
  currentLevel: number
  config?: Awaited<ReturnType<typeof getPartnerConfig>>
}>((set) => ({
  activeIndex: 0,
  partnerLevel: 0,
  currentLevel: 0,
}))

export const useGoogleAuthStore = createWithEqualityFn<{
  checkCode: string
  code: string
}>((set) => ({
  checkCode: "",
  code: "",
}))

export const useStatementStore = createWithEqualityFn<{
  activeIndex: number
  date?: Date
  current?: number
  language: string
  months?: string[]
  updatedAt?: number
}>((set) => ({
  activeIndex: 0,
  date: new Date(),
  language: i18n.language,
  months: [],
  updatedAt: Date.now(),
}))

export type DepositResult =
  | {
      currency: string
      exchangeRate: string
      isNew: 0 | 1
      orderNo: string
      payAccount: string
      payBank: string
      payChannel: number
      payName: string
      recordId: string
      transferAmount: string
      trc20: null
      usdAmount: string
      payType: 3
    }
  | {
      address: string
      price: number
      payType: 0
      orderNo: string
    }
  | {
      address: string
      price: number
      payType: 1
      orderNo: string
    }
  | {
      address: string
      price: number
      payType: 101
      orderNo: string
    }
  | {
      address: string
      price: number
      payType: 102
      orderNo: string
    }

const INITIAL = {
  depositResult: undefined,
  depositRequest: {
    payBank: "",
    payName: "",
    payAccount: "",
  },
  withdrawRequest: {
    wdAccount: "",
    money: undefined,
  },
}

export const useWalletStore = createWithEqualityFn<{
  image?: string
  depositMethod?: PaymentMethod
  withdrawMethod?: WithdrawMethod
  withdrawRequest: {
    wdAccount: string
    money?: number
    gaCode?: string
    emailCode?: string
    recordType?: number
    spId?: string
    timestamp?: number
  }
  depositRequest: {
    payBank: string
    payName: string
    payAccount: string
    amount?: number
  }
  depositResult?: DepositResult
  clean: () => void
}>((set) => ({ ...INITIAL, clean: () => set(INITIAL) }))

export const computeProfit = (
  futures: Pick<
    Position,
    | "linkFuturesCode"
    | "openSafe"
    | "clazzSpread"
    | "volatility"
    | "tradingFee"
    | "overNightFee"
    | "multiplier"
    | "position"
    | "price"
    | "futuresCode"
    | "overPrice"
    | "computeType"
    | "positionsProfit"
  >,
  currentQuotes?: Pick<Quotes, "Ask" | "Bid">
) => {
  const quotes =
    currentQuotes ?? useQuotesStore.getState().quotes[futures.futuresCode!]
  if (!quotes) {
    return futures.positionsProfit ?? 0
  }
  const linkedRate =
    (futures.linkFuturesCode
      ? futures.openSafe === 0
        ? useQuotesStore.getState().quotes[futures.linkFuturesCode]?.Ask
        : useQuotesStore.getState().quotes[futures.linkFuturesCode]?.Bid
      : 1) ?? 1
  const classSpread = futures.clazzSpread || 0
  const volatility = futures.volatility || 0
  const tradingFee = futures.tradingFee || 0
  const overNightFee = futures.overNightFee || 0
  const diff = (classSpread * volatility) / 2
  const multiplier = futures.multiplier || 0
  const position = futures.position || 0
  const price = futures.price || 0

  const profit =
    futures.openSafe === 0
      ? (quotes?.Bid ?? futures.overPrice) - price - diff
      : price - (quotes?.Ask ?? futures.overPrice) - diff

  switch (futures.computeType) {
    case 0:
      return (
        (profit /
          (futures.openSafe === 0 ? quotes.Bid - diff : quotes.Ask - diff)) *
          multiplier *
          position -
        tradingFee -
        overNightFee
      )
    case 1:
      return profit * multiplier * position - tradingFee - overNightFee
    case 2:
      if (futures.linkFuturesCode?.startsWith("USD")) {
        return (
          profit * multiplier * position * linkedRate -
          tradingFee -
          overNightFee
        )
      } else {
        return (
          (profit * multiplier * position) / linkedRate -
          tradingFee -
          overNightFee
        )
      }
    case 3:
    case 4:
    case 6:
    case 8:
    case 12:
      return (
        profit * multiplier * position * linkedRate - tradingFee - overNightFee
      )
    case 5:
    case 7:
    case 9:
    case 10:
    case 11:
      return (
        (profit * multiplier * position) / linkedRate -
        tradingFee -
        overNightFee
      )
    default:
      return 0
  }
}

const getCurrentFuturePrice = (params: {
  futureCode: string
  action: "buy" | "sell"
  volatility?: number
  clazzSpread?: number
  buyPrice?: string | number
  sellPrice?: string | number
  Ask?: number
  Bid?: number
}) => {
  const { Ask, Bid, action, volatility, clazzSpread, buyPrice, sellPrice } =
    params
  const diff = ((volatility ?? 0) * (clazzSpread ?? 0)) / 2
  const price =
    action === "buy"
      ? (Ask ?? Number(buyPrice)) + diff
      : (Bid ?? Number(sellPrice)) - diff
  return price
}
