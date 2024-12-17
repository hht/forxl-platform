interface PaginationResponse<T> {
  /**
   * 总条数
   */
  allNum?: number
  /**
   * 总页数
   */
  pages?: number
  /**
   * 数据列表
   */
  resultList?: T[]
}

/**
 * CountryCodeVo
 */
interface CountryCode {
  /**
   * agent_code
   */
  agentCode?: string
  /**
   * code
   */
  code?: string
  /**
   * country_en
   */
  countryEn?: string
  /**
   * country_zh
   */
  countryZh?: string
}

/**
 * 消息vo
 */
interface Message {
  /**
   * 消息征文
   */
  content?: string
  createTime?: number
  /**
   * 期货code (持仓消息时用到)
   */
  futuresCode?: string
  /**
   * 消息ID
   */
  id?: number
  /**
   * 未读 0 已读 1
   */
  isRead?: number
  /**
   * 消息ID
   */
  messageId?: number
  /**
   * 来源ID type:3(跟单申请ID)
   */
  targetId?: number
  /**
   * 消息标题
   */
  title?: string
  /**
   * 发送消息目标用户
   */
  toId?: string
  /**
   * 类型 0系统消息 /1 充值消息 /3 跟单申请
   */
  type?: number
  updateTime?: number
  /**
   * 用户ID
   */
  userId?: number
}

interface Banner {
  /**
   * bannerId
   */
  bannerId?: number
  /**
   * createTime
   */
  createTime?: Date
  /**
   * 图片地址
   */
  img?: string
  /**
   * isChinese
   */
  isChinese?: number
  /**
   * 状态0显示1隐藏2停用
   */
  isDel?: number
  /**
   * isEnglish
   */
  isEnglish?: number
  /**
   * jumpApp
   */
  jumpApp?: number
  /**
   * jumpFundId
   */
  jumpFundId?: number
  /**
   * jumpType
   */
  jumpType?: number
  /**
   * jumpUrl
   */
  jumpUrl?: string
  /**
   * language
   */
  language?: string
  /**
   * languageList
   */
  languageList?: string[]
  /**
   * 名称
   */
  name?: string
  /**
   * platform
   */
  platform?: number
  /**
   * position
   */
  position?: number
  /**
   * 跳转链接
   */
  src?: string
  /**
   * status
   */
  status?: number
  /**
   * 分类
   */
  type?: number
}
