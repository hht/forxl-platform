interface GetFuturesParams {
  codeOrName?: string
  /**
   * 1
   */
  currentPage: number
  /**
   * 1
   */
  isBest?: 0 | 1
  /**
   * 1
   */
  isSelect?: 0 | 1
  /**
   * 15
   */
  pageSize: number
  /**
   * 1
   */
  power?: number
  /**
   * 类型：FOREX/外汇,
   * SHARES/指数，XAU/黄金，OILFUT/商品，US_EQUITY/美股，DIGICCY/数字货币，HK_EQUITY/港股，UK_EQUITY/英股，EU_EQUITY/欧股，AU_EQUITY/澳股，BASKETS/一篮子
   */
  type?:
    | "FOREX"
    | "SHARES"
    | "XAU"
    | "OILFUT"
    | "US_EQUITY"
    | "DIGICCY"
    | "HK_EQUITY"
    | "UK_EQUITY"
    | "EU_EQUITY"
    | "AU_EQUITY"
    | "BASKETS"
    | "COMMODITY"
    | "European Stocks"
    | "UK Storks"
    | ""
}

interface Future {
  /**
   * buyPrice
   */
  buyPrice?: string
  /**
   * clazzSpread
   */
  clazzSpread?: number
  /**
   * currency
   */
  currency?: string
  dayHigh?: number
  dayLow?: number
  /**
   * fluctuate
   */
  fluctuate?: number
  /**
   * fluctuateAmount
   */
  fluctuateAmount?: number
  /**
   * futuresCode
   */
  futuresCode?: GetFuturesParams["type"]
  /**
   * futuresId
   */
  futuresId?: number
  /**
   * futuresName
   */
  futuresName?: string
  /**
   * futuresShow
   */
  futuresShow?: string
  /**
   * isDeal
   */
  isDeal?: number
  /**
   * isTradeState
   */
  isTradeState?: number
  /**
   * lastClosePrice
   */
  lastClosePrice?: number
  /**
   * remark
   */
  remark?: string
  /**
   * selected
   */
  selected?: 0 | 1
  /**
   * sellPrice
   */
  sellPrice?: string
  /**
   * spread
   */
  spread?: string
  /**
   * type
   */
  type?: string
  /**
   * ufId
   */
  ufId?: number
  /**
   * volatility
   */
  volatility?: number
  linkFuturesCode?: GetFuturesParams["type"]
}

interface Quotes {
  Symbol: string
  Ask: number
  Bid: number
  High: number
  Low: number
  LastTime: number
}

interface Position {
  /**
   * 开仓金额
   */
  amount?: number
  cancelPrice?: number
  cancelTime?: number
  /**
   * 合约组别点差
   */
  clazzSpread?: number
  /**
   * 计算类型
   */
  computeType?: number
  createTime?: number
  /**
   * exchangeRate
   */
  exchangeRate?: string
  /**
   * 跟随订单id
   */
  followOrderId?: string
  /**
   * fundAreaname
   */
  fundAreaName?: string
  /**
   * 期货代码
   */
  futuresCode?: string
  /**
   * 券商产品ID
   */
  futuresId?: number
  /**
   * 券商产品名称
   */
  futuresName?: string
  /**
   * 券商产品显示
   */
  futuresShow?: string
  /**
   * futureType
   */
  futureType?: string
  /**
   * 持仓ID
   */
  id?: number
  /**
   * 是否隔夜: 否(0), 是(1)
   */
  isOverNight?: number
  /**
   * lastPrice
   */
  lastPrice?: string
  /**
   * 杠杆
   */
  level?: number
  /**
   * 挂单的时候，属于limit还是stop   1 limit  2 stop
   */
  limitType?: number
  /**
   * 交叉货币对的计价货币对的 code
   */
  linkFuturesCode?: string
  /**
   * 合约规格
   */
  multiplier?: number
  /**
   * 持仓类型 0,(多单)/1,(空单)
   */
  openSafe?: number
  /**
   * 持仓订单号
   */
  orderSn?: string
  /**
   * 隔夜费
   */
  overNightFee?: number
  /**
   * 平仓价
   */
  overPrice?: number
  overTime?: number
  pendingTime?: number
  /**
   * 总手
   */
  position?: number
  /**
   * 用户持仓中 动态盈亏
   */
  positionsProfit?: number
  /**
   * 开仓价
   */
  price?: number
  /**
   * 盈亏
   */
  profit?: number
  /**
   * 保证金
   */
  securityDeposit?: number
  /**
   * 证券平台id
   */
  spId?: number
  /**
   * 点差
   */
  spread?: number
  /**
   * 订单状态
   */
  state?: number
  /**
   * 止损价
   */
  stopLossPrice?: number
  /**
   * 止盈价
   */
  stopProfitPrice?: number
  /**
   * 交易手续费
   */
  tradingFee?: number
  /**
   * 订单类型: 简易(0), 高级(1)
   */
  type?: number
  /**
   * 用户组别名(后管展示用)
   */
  userClazzName?: string
  /**
   * 用户跟单设置ID
   */
  userFollowId?: string
  /**
   * 用户ID
   */
  userId?: number
  /**
   * 交易步长
   */
  volatility?: number
  priceProfit?: number | null
}

interface OrderParams {
  futuresId: number
  byOrSell: 0 | 1 | 7
  positions:
    | {
        spId: number
        position: number
        price: number
        openSafe: 0 | 1
        isOverNight: 0 | 1
        stopProfitPrice: number
        stopLossPrice: number
      }
    | {
        id: number
      }
}

interface FuturesDetail {
  /**
   * fluctuate
   */
  fluctuate?: number
  futures?: Futures
  futuresParam?: FuturesParam
  futuresTimeList?: FuturesTime[]
  lastClosePrice?: number
  linkFuturesCode?: LinkFuturesCode
  market?: FuturesMarket
  priceChange?: PriceChange
  /**
   * spread
   */
  spread?: number
}

interface Futures {
  /**
   * broker
   */
  broker?: string
  /**
   * bullish
   */
  bullish?: number
  /**
   * clazzId
   */
  clazzId?: number
  /**
   * clazzName
   */
  clazzName?: string
  /**
   * clazzSpread
   */
  clazzSpread?: number
  /**
   * currency
   */
  currency?: string
  /**
   * delistTime
   */
  delistTime?: Date
  /**
   * fixDepositRatio
   */
  fixDepositRatio?: number
  /**
   * frequency
   */
  frequency?: number
  /**
   * futuresCode
   */
  futuresCode?: GetFuturesParams["type"]
  /**
   * futuresDate
   */
  futuresDate?: string
  /**
   * futuresId
   */
  futuresId?: number
  /**
   * futuresImg
   */
  futuresImg?: string
  /**
   * futuresName
   */
  futuresName?: string
  /**
   * futuresCode
   */
  futuresNameZh?: string
  /**
   * futuresShow
   */
  futuresShow?: string
  /**
   * isBest
   */
  isBest?: number
  /**
   * isDeal
   */
  isDeal?: number
  /**
   * isTradeState
   */
  isTradeState?: number
  /**
   * multiplier
   */
  multiplier?: number
  /**
   * power
   */
  power?: number
  /**
   * profitType
   */
  profitType?: number
  /**
   * remark
   */
  remark?: string
  /**
   * remarkJSON
   */
  remarkJSON?: string
  /**
   * sequence
   */
  sequence?: number
  /**
   * shelfTime
   */
  shelfTime?: Date
  /**
   * spId
   */
  spId?: number
  /**
   * spread
   */
  spread?: number
  /**
   * status
   */
  status?: number
  /**
   * throwPlatformId
   */
  throwPlatformId?: number
  /**
   * tradingFee
   */
  tradingFee?: number
  /**
   * type
   */
  type?: string
  /**
   * ufId
   */
  ufId?: number
  /**
   * volatility
   */
  volatility?: number
}

interface FuturesParam {
  /**
   * bullish
   */
  bullish?: number
  /**
   * dealState
   */
  dealState?: number
  /**
   * downOverNightFee
   */
  downOverNightFee?: number
  fixDepositRatio?: number
  /**
   * futuresCode
   */
  futuresCode?: string
  /**
   * id
   */
  id?: number
  /**
   * lever
   */
  lever?: number
  /**
   * maxVolume
   */
  maxVolume?: number
  /**
   * minVolume
   */
  minVolume?: number
  /**
   * multiplier
   */
  multiplier?: number
  /**
   * overNightDay
   */
  overNightDay?: number
  /**
   * overNightFee
   */
  overNightFee?: number
  /**
   * paymentType
   */
  paymentType?: number
  /**
   * profitType
   */
  profitType?: number
  /**
   * spread
   */
  spread?: number
  /**
   * tradingFee
   */
  tradingFee?: number
  /**
   * volatility
   */
  volatility?: number
}

/**
 * FuturesTimeVo
 */
interface FuturesTime {
  /**
   * closeTime
   */
  closeTime?: string
  closeTimestamp?: number
  /**
   * endWeek
   */
  endWeek?: string
  /**
   * futuresId
   */
  futuresId?: number
  /**
   * id
   */
  id?: number
  /**
   * openTime
   */
  openTime?: string
  openTimestamp?: number
  /**
   * startWeek
   */
  startWeek?: string
  /**
   * 时区设置 +2 / +3
   */
  timezone?: string
  /**
   * type
   */
  type?: number
}

/**
 * LinkFuturesCodeVo
 */
interface LinkFuturesCode {
  /**
   * deposit
   */
  deposit?: string
  /**
   * profit
   */
  profit?: string
}

/**
 * FuturesMarketVo
 */
interface FuturesMarket {
  buyPrice?: string
  currency?: string
  futuresCode?: string
  futuresDate?: string
  futuresId?: number
  lastUpdateTime?: Date
  sellPrice?: string
  type?: string
}

/**
 * PriceChangeVo
 */
interface PriceChange {
  day?: PriceChangeDay
  hour?: PriceChangeHour
  minuteFive?: PriceChangeMinute
  [property: string]: any
}

/**
 * PriceChangeDayVo
 */
interface PriceChangeDay {
  max?: number
  min?: number
}

/**
 * PriceChangeHourVo
 */
interface PriceChangeHour {
  max?: number
  min?: number
}

/**
 * PriceChangeMinuteVo
 */
interface PriceChangeMinute {
  max?: number
  min?: number
}

type FuturesOrder = Pick<
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
>
