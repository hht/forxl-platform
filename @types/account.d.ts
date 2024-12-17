/**
 * 用户详情vo
 */
interface Account {
  /**
   * 通讯地址
   */
  address?: string
  agencyCode?: string
  agencyId?: number
  agencyName?: string
  /**
   * 实名认证ID
   */
  authIdCard?: string
  /**
   * 实名认证姓名
   */
  authName?: string
  /**
   * 实名认证状态 1：已提交待审核、2：审核通过、3、审核不通过
   */
  authState?: number
  /**
   * 生日
   */
  birthday?: string
  channelCode?: string
  channelId?: number
  channelName?: string
  /**
   * 城市code
   */
  cityCode?: string
  /**
   * 用户分组名称
   */
  className?: string
  /**
   * 组别点差 (0 为浮动点差， 大于0 则为固定点差)
   */
  classSpread?: number
  /**
   * 手机号
   */
  code?: string
  coinBalance?: number
  commision?: number
  communicationStatus?: number
  /**
   * 协议照片
   */
  contractImg?: string
  countryCode?: string
  createTime?: Timestamp
  dappAddress?: string
  /**
   * 登陆设备 1，安卓 2 iOS
   */
  device?: number
  /**
   * 登陆邮箱
   */
  email?: string
  fictitiousUserId?: number
  /**
   * 首充(渠道返佣有用)
   */
  firstCharge?: number
  freezeMoney?: number
  /**
   * 可购买基金区域ID
   */
  fundAreaId?: number
  /**
   * 可购买基金区域名
   */
  fundAreaName?: string
  /**
   * 性别 0，男/1，女
   */
  gender?: number
  /**
   * 是否设置支付密码 0，否/1， 是
   */
  hasPayPwd?: number
  /**
   * 是否设置密码 0，否/1，是
   */
  hasPwd?: number
  /**
   * 头像
   */
  headImg?: string
  /**
   * 用户ID
   */
  id?: number
  /**
   * 身份证号码
   */
  idCard?: string
  /**
   * 身份证正面
   */
  idcardImg?: string
  /**
   * 身份证反面
   */
  idcardImgO?: string
  incomeTotal?: number
  /**
   * 简介
   */
  introduction?: string
  /**
   * 邀请码
   */
  inviteCode?: string
  invitedUserIdArr?: string
  inviteNumber?: string
  inviteUser?: string
  isAgencyId?: number
  isBindPlatform?: number
  landingTime?: Date
  lastCommunication?: Date
  lever?: number
  lotTotal?: number
  /**
   * 姓名
   */
  name?: string
  /**
   * 昵称
   */
  nickName?: string
  orderCountTotal?: number
  /**
   * 邀请人ID
   */
  parentId?: number
  payPwd?: string
  phoneVCode?: string
  /**
   * 代理Id
   */
  pid?: number
  platFormName?: string
  positionNum?: number
  presentTotal?: number
  proxyId?: number
  /**
   * 登陆密码
   */
  pwd?: string
  realAccountId?: number
  realMoney?: number
  rebate?: number
  rebateMoney?: number
  recordNum?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 销售经理
   */
  salesId?: number
  salesName?: string
  spId?: number
  /**
   * 账号状态 0待审核/1已通过/2拒绝/3删除/4资料已提交
   */
  state?: number
  status?: string
  tag?: string
  title?: string
  totalGuessAmount?: number
  totalMoney?: number
  /**
   * 0普通用户，1代理商
   */
  type?: number
  url?: string
  userCount?: number
  ustate?: number
  vsupMoney?: number
  /**
   * 白名单标记
   */
  whiteFlag?: number
  withdrawTotal?: number
}

interface Certification {
  name: string
  country: string
  typeOfDocument: string
  certificateNumber: string
  status: "FINAL" | "GREEN" | "INIT" | "PROCESS" | "RETRY"
  createTime: number
  updateTime: number
  refusalMsg: string
  tags: string[]
}
interface Profile {
  agency?: Agency
  config?: UserConfig
  /**
   * 已邀请好友信息
   */
  inviteUserList?: Agent[]
  traderDetail?: Trader
  user?: Account
  realName?: Certification
}

/**
 * 代理信息配置vo
 */
interface Agency {
  /**
   * 邀请链接
   */
  inviteLink?: string
  /**
   * rebate
   */
  rebate?: number
  /**
   * rebateAmount
   */
  rebateAmount?: number
}

/**
 * 配置vo
 */
interface UserConfig {
  ckey?: string
  /**
   * configId
   */
  configId?: number
  /**
   * 描述
   */
  content?: string
  cvalue?: string
  /**
   * 0 管理 1 交易
   */
  type?: number
}

/**
 * 代理商信息vo
 */
interface Agent {
  /**
   * 交易量
   */
  businessVolume?: number
  createTime?: Date
  /**
   * 头像
   */
  headImg?: string
  /**
   * 用户ID
   */
  id?: number
  /**
   * 昵称
   */
  nickName?: string
  rebateProfit?: number
}

/**
 * 操盘手信息vo
 */
interface Trader {
  /**
   * 余额
   */
  asset?: number
  /**
   * 头像
   */
  avatar?: string
  /**
   * 平均亏损点
   */
  avgLoss?: number
  /**
   * 平均持仓时间
   */
  avgOpenTime?: number
  /**
   * 平均盈利点
   */
  avgProfit?: number
  /**
   * 成为交易员日期
   */
  becomeTime?: Date
  /**
   * 取消状态 0取消 1 未取消
   */
  cancelStatus?: number
  /**
   * 操盘手总盈亏点数图表
   */
  charts?: { [key: string]: any }[]
  /**
   * 收藏 id
   */
  collectId?: number
  /**
   * 净值
   */
  equity?: number
  /**
   * 跟随总金额
   */
  followAmount?: number
  /**
   * 0：未收藏(默认)，1：已收藏
   */
  followed?: number
  /**
   * 跟随者收益
   */
  followerProfit?: number
  /**
   * 跟随 id
   */
  followId?: number
  /**
   * 正在跟随人数
   */
  followingNumber?: number
  /**
   * 跟随总人次
   */
  followingSum?: number
  /**
   * 实盘跟随总额
   */
  followMoneySum?: number
  /**
   * 跟随次数
   */
  followNumber?: number
  /**
   * 跟随收益
   */
  followProfit?: number
  /**
   * 名称
   */
  fullname?: string
  /**
   * 中文名称
   */
  fullnameZh?: string
  /**
   * 操盘手组别id
   */
  gid?: number
  /**
   * 总亏损
   */
  grossLoss?: number
  /**
   * 总盈利
   */
  grossProfit?: number
  /**
   * guid
   */
  guid?: string
  /**
   * 胜出率
   */
  hitRatio?: number
  /**
   * 个人简介
   */
  introduction?: string
  /**
   * 是否推荐
   */
  isBest?: number
  /**
   * largestDrawDown
   */
  largestDrawDown?: number
  /**
   * 最新价格
   */
  lastPrice?: string
  /**
   * 最近下单时间
   */
  lastTraded?: number
  /**
   * 亏损率
   */
  lossRate?: number
  /**
   * 亏损订单数
   */
  lostOrders?: number
  /**
   * 最大回撤率
   */
  maxDrawDownRate?: number
  /**
   * 开户周期
   */
  openCycle?: number
  /**
   * 订单数
   */
  ordersNumber?: number
  /**
   * 利润因子
   */
  profitFactor?: number
  /**
   * 跟随盈利
   */
  profitFromCopy?: number
  /**
   * 盈利订单数
   */
  profitOrders?: number
  /**
   * 盈利率
   */
  profitRate?: number
  /**
   * 收益率
   */
  returnRate?: number
  /**
   * 投资回报率
   */
  roi?: number
  /**
   * 状态 0禁用 1启用
   */
  status?: number
  /**
   * 时间范围
   */
  timeFrame?: string
  /**
   * 净利润
   */
  totalNetProfit?: number
  /**
   * tradingTimeScale
   */
  tradingTimeScale?: number
}

/**
 * UserOrderAnalysisVo
 */
interface UserOrderAnalysis {
  /**
   * 余额
   */
  asset?: string
  /**
   * 平均亏损点
   */
  avgLoss?: number
  /**
   * 平均持仓时间
   */
  avgOpenTime?: number
  /**
   * 平均盈利点
   */
  avgProfit?: number
  /**
   * beFollowedProfit
   */
  beFollowedProfit?: number
  /**
   * 净值
   */
  equity?: string
  /**
   * 跟随总额
   */
  followAmount?: number
  /**
   * 累计跟随次数
   */
  followCount?: number
  /**
   * 跟随收益
   */
  followProfit?: number
  /**
   * 总亏损
   */
  grossLoss?: number
  /**
   * 总盈利
   */
  grossProfit?: number
  /**
   * headImg
   */
  headImg?: string
  /**
   * 胜出率
   */
  hitRate?: number
  /**
   * id
   */
  id?: number
  /**
   * 用户个人简介
   */
  introduction?: string
  /**
   * 近12周最大回撤率
   */
  last12WeekMaxDrawDownRate?: number
  /**
   * 亏损订单数
   */
  lostOrders?: number
  /**
   * 最大回撤率
   */
  maxDrawdown?: string
  /**
   * nickName
   */
  nickName?: string
  /**
   * openCycle
   */
  openCycle?: number
  /**
   * 利润因子
   */
  profitFactor?: number
  /**
   * 盈利订单数
   */
  profitOrders?: number
  /**
   * realTimeFollowTotals
   */
  realTimeFollowTotals?: number
  /**
   * 收益率
   */
  returnRate?: number
  /**
   * 净利润
   */
  totalNetProfit?: number
  /**
   * updateTime
   */
  updateTime?: Date
  /**
   * userId
   */
  userId?: number
}
