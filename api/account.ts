import { request } from '~/hooks/useRequest'
import { useFroxlStore } from '~/hooks/useStore'
import { i18n, t } from '~/lib/utils'

type SignUpParams = {
  /**
   * 邮箱
   */
  email: string
  /**
   * 邀请码
   */
  inviteCode?: string
  /**
   * 语言
   */
  language: string
  /**
   * 密码
   */
  password: string
}

/**
 * 用户登录接口
 */
export const signIn = async (params: { email: string; password: string }) => {
  const { user, userNumber } = await request<
    { pwdMatches?: boolean; user?: Account; userNumber?: string },
    { user: { code: string; pwd: string } }
  >("/other/userLogin", "POST", {
    user: { code: params.email, pwd: params.password },
  })
  useFroxlStore.setState({ userNumber, account: user })
  await getProfile()
}

/**
 * 用户注册接口
 * @param params
 * @returns
 */
export const register = async (params: SignUpParams) => {
  const registered = await request<string | null, { code: string }>(
    "/other/v3/registerCheck",
    "POST",
    {
      code: params.email,
    }
  )
  if (registered) {
    throw new Error("TODO")
  }
  if (params.inviteCode) {
    await request<boolean, { inviteCode: string }>(
      `/user/validInviteCode?inviteCode=${params.inviteCode}`,
      "POST"
    )
  }
  await request<string, SignUpParams>("/notice/sendVerificationEmail", "POST", {
    ...params,
    language: i18n.language,
  })
}

/**
 * 用户信息查询
 */

export const getProfile = async () => {
  return await request<Profile, undefined>("/user/getUser", "POST").then(
    (res) => {
      useFroxlStore.setState({ account: res.user, realName: res.realName })
      return res
    }
  )
}

/**
 * 用户认证信息查询
 */
export const getAuthentication = async () => {
  return await request<any, undefined>("/user/authenticationUserInfo", "POST")
}

/**
 * 获取用户认证标识
 */
export const getAttestationFlag = async () => {
  return await request<
    {
      email: boolean
      /**
       * 是否ga认证
       */
      ga: boolean
      id: number
      /**
       * 是否实名认证
       */
      kyc: boolean
    },
    undefined
  >("/userAttestationFlag/fetch", "POST")
}

/**
 * 修改密码
 */
export const changePassword = async (params: {
  password: string
  previous: string
}) => {
  await request("/user/verifyOldPwd", "POST", {
    oldPwd: params.previous,
  })
  return await request("/user/updatePwd", "POST", {
    pwd: params.previous,
    newPwd: params.password,
  })
}

/**
 * 用户订单分析
 */
export const getOrderAnalysis = async (userId: number) => {
  return await request<UserOrderAnalysis, { userId: number }>(
    "/userOrderAnalysis/getUserData",
    "POST",
    { userId }
  )
}

/**
 * 忘记密码发送邮件
 */
export const sendPasswordChangeEmail = async (email: string) => {
  return await request("/notice/sendPasswordRestEmail", "POST", { email })
}

/**
 * 重置密码
 */
export const resetPassword = async (params: {
  password: string
  email: string
  token: string
}) => {
  return await request("/user/restPwd", "POST", params)
}

/**
 * 获取修改邮箱验证吗
 */
export const getEmailCode = async (params: { email: string; type: 3 | 7 }) => {
  return await request("/other/phoneVCode", "POST", {
    code: params.email,
    type: params.type,
  })
}

/**
 * 验证修改邮箱验证码
 */
export const verifyEmailCode = async (code: string) => {
  return await request("/user/verificationCode", "POST", {
    code: useFroxlStore.getState().account?.email,
    type: 7,
    verificationCode: code,
  })
}

/**
 * 修改邮箱
 */
export const changeEmail = async (params: {
  code: string
  checkCode: string
  vCode: string
}) => {
  return await request("/user/userCodeEdit", "POST", params)
}

/**
 * 获取GA认证信息
 */
export const getGaInfo = async () => {
  return await request<{ pngStr: string; secret: string }, undefined>(
    "/userGa/getSecret",
    "POST"
  )
}

/**
 * 绑定GA认证
 */
export const bindGa = async (params: { code: string; secret: string }) => {
  return await request("/userGa/openGaValidate", "POST", params)
}

/**
 * 更新GA认证
 */
export const updateGa = async (params: {
  code: string
  checkCode: string
  secret: string
}) => {
  await request("/userGa/validateBeforeChange", "POST", {
    code: params.checkCode,
  })
  return await request("/userGa/changeGaValidate", "POST", {
    ...params,
    checkCode: params.checkCode,
    newCode: params.code,
  })
}

/**
 * 关闭GA认证
 */
export const closeGa = async (params: { code: string }) => {
  return await request("/userGa/closeGaValidate", "POST", params)
}

/**
 * 验证邮箱
 * @param params
 * @returns
 */
export const verifyEmail = async (params: any) => {
  return await request("/notice/emailVerify", "GET", params)
}

/**
 * 删除账号
 * @returns
 */
export const deleteAccount = async () => {
  return await request("/user/deleteAccount", "POST")
}

/**
 * 获取SumSubToken
 * @returns
 */
export const getSumSubToken = async () => {
  return await request<string, undefined>("/userRealName/init", "POST")
}

/**
 * 获取用户实名认证信息
 */
export const getRealNameInfo = async () => {
  return await request<
    {
      data?: Certification
    },
    undefined
  >("/userRealName/getByUserId", "POST")
}
