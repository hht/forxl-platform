import { useRequest } from "ahooks"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { ToggleFavorite } from "./toggle-favorate"

import { getFuture, proceedOrder } from "~/api/trade"
import { Icon, Text, toast, XStack, YStack } from "~/components"
import { CACHE_KEY } from "~/hooks/useRequest"
import {
  useQuotesStore,
  useStatisticsStore,
  useSymbolStore,
} from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { DEVICE_WIDTH } from "~/lib/utils"
import colors from "~/theme/colors"

export const FutureDetail = () => {
  const { t } = useTranslation()
  const {
    action,
    order,
    enablePending,
    enableCloseProfit,
    enableCloseLoss,
    currentFuture,
    futureParams,
  } = useQuotesStore(
    (state) => ({
      currentFuture: state.currentFuture,
      action: state.action,
      order: state.order,
      enablePending: state.enablePending,
      enableCloseProfit: state.enableCloseProfit,
      enableCloseLoss: state.enableCloseLoss,
      futureParams: state.futures[state.currentFuture?.futuresShow!],
    }),
    shallow
  )
  const available = useStatisticsStore((state) => state?.available, shallow)
  const { loading, run } = useRequest(proceedOrder, {
    manual: true,
    onSuccess: () => {
      useQuotesStore.setState({ order: { position: 0.01 } })
      toast.show(t("message.orderSuccess"))
    },
  })
  const { data: future } = useRequest(
    () => getFuture(currentFuture?.futuresCode!),
    {
      refreshDeps: [currentFuture?.futuresCode],
      ready: !!currentFuture?.futuresCode && !futureParams,
      cacheKey: `${CACHE_KEY.FUTURE}_${currentFuture?.futuresCode}`,
      onSuccess: (data) => {
        subscribeQuotes([
          data.futures?.futuresCode!,
          data.linkFuturesCode?.deposit,
        ])
      },
    }
  )

  const requiredMargin = future
    ? (order?.position ?? 0) * (future.futuresParam?.fixDepositRatio ?? 0)
    : 0

  const futuresOrder: FuturesOrder = useMemo(
    () => ({
      linkFuturesCode: future?.linkFuturesCode?.deposit,
      position: order?.position,
      openSafe: action === "buy" ? 0 : 1,
      clazzSpread: future?.futures?.clazzSpread,
      volatility: future?.futures?.volatility ?? 0.01,
      tradingFee:
        (future?.futuresParam?.tradingFee ?? 0) * (order?.position ?? 0),
      overNightFee: 0,
      multiplier: future?.futuresParam?.multiplier,
      price: order?.price,
      futuresCode: future?.futures?.futuresCode,
      overPrice: order?.price ?? 0,
      computeType: future?.futuresParam?.paymentType,
    }),
    [future, order, action]
  )

  return (
    <YStack
      f={1}
      w={DEVICE_WIDTH}
      btlr="$md"
      btrr="$md"
      bc="$card/60"
      boc="$border"
      bw={1}
      p="$md"
    >
      <XStack>
        <XStack ai="center">
          <XStack
            hitSlop={16}
            onPress={() => {
              useSymbolStore.setState({ index: 0 })
            }}
          >
            <Icon name="arrowLeft" size={20} color={colors.text}></Icon>
          </XStack>
        </XStack>
        <Text f={1} ta="center" fos={17} lh={22} fow="bold">
          {currentFuture?.futuresShow}
        </Text>
        <ToggleFavorite />
      </XStack>
    </YStack>
  )
}
