import _ from "lodash"

import { request } from "~/hooks/useRequest"

export const getPartnerInfo = async () => {
  return await request<
    {
      data: {
        level: number
        activeDirectNum: number
        allDirectNum: number
        teamSize: number
        teamVolume: number
        earned: number
        lastUpdateTime: number
        currentLevel: {
          funds: number
          market: number
          level: number
        }
        nextLevel: {
          level: number
          funds: number
          market: number
          offlineCount: number
        }
      }
    },
    undefined
  >("/partner/info", "POST").then((res) => res.data)
}

export const getPartnerConfig = async () => {
  return await request<
    {
      data: {
        funds: number
        id: number
        languageList: {
          id: number
          language: string
          levelId: number
          name: string
        }[]
        level: number
        levelCode: string
        market: number
        offlineCount: number
        ratio: number
      }[]
    },
    undefined
  >("/partner/queryLevelConfig", "POST").then((res) => res.data)
}

export const getBonusConfig = async () => {
  return await request<
    {
      data: { generation1: number; generation2: number; generation3: number }
    },
    undefined
  >("/bonus/referralBonusParams", "POST").then((res) => res.data)
}

export const getBonusInfo = async () => {
  return await request<
    { data: { earned: number; spillover: number } },
    undefined
  >("/bonus/info", "POST").then((res) => res.data)
}

export const getReferralList = async () => {
  return await request<
    {
      data: {
        certificationName?: string
        email?: string
        invested?: number
        level?: number
        registrationDate?: number
        teamSize?: number
        teamVolume?: number
        userId?: number
      }[]
    },
    undefined
  >("/partner/offlineList", "POST").then((res) =>
    _.orderBy(res.data, ["level", "teamSize"], ["desc", "desc"])
  )
}
