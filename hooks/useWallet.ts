import { useInterval } from 'ahooks'
import _ from 'lodash'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { CACHE_KEY, useRequest } from './useRequest'
import { computeProfit, useOrderStore, useStatisticsStore } from './useStore'
import { subscribeQuotes, useWebSocket } from './useWebsocket'

import { getAttestationFlag, getProfile } from '~/api/account'
import { getOpenPositions } from '~/api/trade'

export const useWallet = () => {
  useWebSocket()
  const { wallet, orders } = useOrderStore((state) => {
    return {
      wallet: state.wallet,
      orders: state.orders,
    }
  }, shallow)
  useEffect(() => {
    if (orders?.length) {
      subscribeQuotes(
        _.uniq(
          orders
            .map((it) => it.futuresCode!)
            .concat(orders.map((it) => it.linkFuturesCode!))
        )
      )
    }
  }, [orders])
  useRequest(getOpenPositions, {
    cacheKey: CACHE_KEY.POSITIONS,
  })
  useInterval(() => {
    const profit = _.round(
      orders?.reduce((acc, it) => acc + computeProfit(it), 0) ?? 0,
      2
    )
    const diff = _.isUndefined(wallet?.profitLoss)
      ? profit
      : profit - wallet.profitLoss

    const totalMoney = _.round(
      wallet?.totalMoney ? Number(wallet.totalMoney) + diff : 0,
      2
    )

    // const available = _.round(
    //   wallet?.available ? Number(wallet.available) + diff : 0,
    //   2
    // )

    const freezeMoney = _.round(
      wallet?.freezeMoney ? Number(wallet.freezeMoney) : 0,
      2
    )

    const supFreezeMoney = _.round(
      wallet?.supFreezeMoney ? Number(wallet.supFreezeMoney) + diff : 0,
      2
    )
    useStatisticsStore.setState({
      totalMoney,
      available: wallet?.supMoney ?? 0,
      freezeMoney,
      supFreezeMoney,
      profit,
    })
    return
  }, 500)
}

export const useVerification = () => {
  const { data: attestation } = useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
  })
  const { data: profile } = useRequest(getProfile, {
    cacheKey: CACHE_KEY.USER,
  })
  return {
    ga: attestation?.ga,
    kyc: attestation?.kyc || profile?.realName.status === "GREEN",
  }
}
