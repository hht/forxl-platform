import { useRequest, useUnmount } from "ahooks"
import { router } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { Action, CurrentPrice } from "./current-price"
import { FutureInfo } from "./future-info"
import { OrderActions } from "./order-actions"
import { PendingCard } from "./pending"
import { StopLossCard } from "./stop-loss"
import { StopProfitCard } from "./stop-profit"
import { ToggleFavorite } from "./toggle-favorite"
import { TradeVolume } from "./volume"

import { getFuture } from "~/api/trade"
import {
  Card,
  Icon,
  ScrollView,
  Tabs,
  Text,
  XStack,
  YStack,
} from "~/components"
import { CACHE_KEY } from "~/hooks/useRequest"
import { useQuotesStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { DEVICE_WIDTH } from "~/lib/utils"
import colors from "~/theme/colors"

export const FutureDetail = () => {
  const { t } = useTranslation()
  const dict = t("trade", {
    returnObjects: true,
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const { action, order, currentFuture, futureParams } = useQuotesStore(
    (state) => ({
      currentFuture: state.currentFuture,
      action: state.action,
      order: state.order,
      futureParams: state.futures[state.currentFuture?.futuresShow!],
    }),
    shallow
  )

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
      onError: (error) => {},
    }
  )

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
  const ref = useRef<ScrollView>(null)
  useUnmount(() => {
    useQuotesStore.setState({
      currentFuture: undefined,
      enableCloseLoss: false,
      enableCloseProfit: false,
      enablePending: false,
      order: { position: 0.01 },
    })
  })
  useEffect(() => {
    ref.current?.scrollTo({ x: activeIndex * DEVICE_WIDTH, animated: true })
  }, [activeIndex])
  return (
    <YStack
      f={1}
      w={DEVICE_WIDTH}
      btlr="$md"
      btrr="$md"
      bc="$card/60"
      boc="$border"
      bw={1}
      pt="$md"
      mt="$md"
    >
      <XStack px="$md">
        <XStack ai="center">
          <XStack
            hitSlop={16}
            onPress={() => {
              router.back()
            }}
          >
            <Icon name="arrowLeft" size={20} color={colors.text}></Icon>
          </XStack>
        </XStack>
        <Text f={1} ta="center" heading bold>
          {currentFuture?.futuresShow}
        </Text>
        <ToggleFavorite />
      </XStack>
      <XStack p="$md" pb={0} bbc="$border" bbw={1}>
        <Tabs
          data={[dict.newPosition, dict.chart, dict.info]}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </XStack>

      <ScrollView
        ref={ref}
        f={1}
        horizontal
        w={DEVICE_WIDTH}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false}
      >
        <ScrollView f={1} w={DEVICE_WIDTH} showsVerticalScrollIndicator={false}>
          <YStack p="$md" gap="$sm" w="100%">
            <Card bw={0}>
              <XStack ai="center" jc="space-between">
                <CurrentPrice />
                <Action />
              </XStack>
            </Card>
            <TradeVolume future={future} />
            <PendingCard
              step={(futuresOrder.volatility ?? 0.01) * 100}
              precision={
                futuresOrder.volatility!.toString().split(".")[1]?.length
              }
            />
            <StopProfitCard futuresOrder={futuresOrder} />
            <StopLossCard futuresOrder={futuresOrder} />
            <OrderActions />
          </YStack>
        </ScrollView>
        <ScrollView f={1} w={DEVICE_WIDTH} showsVerticalScrollIndicator={false}>
          <YStack p="$md" gap="$sm" w="100%" />
        </ScrollView>
        <ScrollView f={1} w={DEVICE_WIDTH} showsVerticalScrollIndicator={false}>
          <FutureInfo
            future={future}
            onPress={() => {
              setActiveIndex(0)
            }}
          />
        </ScrollView>
      </ScrollView>
    </YStack>
  )
}
