interface Wallet {
  forexAccount?: ForexAccount
  fundsAccount?: FundsAccount
  userAsset?: UserAsset
}

/**
 * ForexAccount
 */
interface ForexAccount {
  /**
   * 可用金额
   */
  available?: number
  /**
   * 已用保证金
   */
  freezeMoney?: number
  /**
   * 外汇账户余额
   */
  futuresSupMoney?: number
  /**
   * 持仓盈亏
   */
  profitLoss?: number
  spId?: number
  /**
   * 可用保证金
   */
  supFreezeMoney?: number
  /**
   * 期权账户净值
   */
  totalMoney?: number
  updateTime?: Date
  userId?: number
}

/**
 * FundsAccount
 */
interface FundsAccount {
  /**
   * 账户佣金金额
   */
  rebateMoney?: number
  /**
   * 资金账户余额
   */
  supMoney?: number
  /**
   * 资金账户总存款
   */
  totalDeposit?: number
  /**
   * 资金账户总取款
   */
  totalWithdrawals?: number
  updateTime?: Date
  userId?: number
}

/**
 * UserAsset
 */
interface UserAsset {
  /**
   * 当日收益
   */
  profit?: number
  /**
   * 总资产
   */
  totalAmount?: number
  /**
   * 总收益
   */
  totalProfit?: number
  updateTime?: Date
  userId?: number
}

interface PaymentMethod {
  additional?: string
  areaList?: string
  areaListArray?: string[]
  arrivalTimeDesc?: string
  /**
   * 通道编码
   */
  code?: string
  /**
   * 创建时间
   */
  createTime?: Date
  /**
   * 收款币种
   */
  currency?: string
  /**
   * 收款汇率
   */
  exchangeRate?: number
  fee?: number
  /**
   * ID
   */
  id?: number
  incomeMoneyMax?: number
  incomeMoneyMin?: number
  /**
   * isRecommend
   */
  isRecommend?: number
  /**
   * 通道名称
   */
  name?: string
  /**
   * 收款账户
   */
  payAccount?: string
  /**
   * 支付请求连接
   */
  payApiUrl?: string
  /**
   * 收款银行
   */
  payBank?: string
  payChannel?: number
  /**
   * 收款方姓名
   */
  payName?: string
  /**
   * payNameRequired
   */
  payNameRequired?: number
  payType?: 0 | 1 | 3
  /**
   * 图标地址
   */
  picUrl?: string
  /**
   * remark
   */
  remark?: string
  /**
   * sort
   */
  sort?: number
  /**
   * 状态 0 启用 1禁用
   */
  status?: string
  trc20?: string
  /**
   * 更新时间
   */
  updateTime?: Date
  /**
   * 实名认证 ：0 不需要 1 需要
   */
  userAuth?: number
}

interface WithdrawMethod {
  areaList: string
  areaListArray: string[]
  arrivalTimeDesc: string
  channelCode: string
  channelName: string
  channelType: 0 | 1 | 3
  createTime: number
  currency: string
  description: string
  exchangeRate: number
  feeType: number
  feeValue: number
  feeValueMax: string
  feeValueMin: string
  id: number
  isAutoPay: 0 | 1
  isRecommend: 0 | 1
  maxAmount: string
  minAmount: string
  paymentPartyCode: number
  picUrl: string
  sort: number
  state: number
  updateTime: number
  userAuth: number
  validationRegex: string
}
