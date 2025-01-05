import BottomSheetBase from "@gorhom/bottom-sheet"
import { useUnmount } from "ahooks"
import { Fragment, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { Collapse, Icon, Input, Text, XStack, YStack } from "~/components"
import { useOrderStore } from "~/hooks/useStore"
import { ProfitTracker } from "~/widgets/(home)/tabs/positions/profit-tracker"

const useStore = createWithEqualityFn<{ title?: string; desc?: string }>()(
  (set) => ({})
)

export const useProfitAndLossStore = createWithEqualityFn<{
  stopProfitPrice?: number
  stopLossPrice?: number
  enableCloseProfit?: boolean
  enableCloseLoss?: boolean
}>()((set) => ({
  enableCloseProfit: false,
  enableCloseLoss: false,
}))

export const ProfitAndLoss = () => {
  const { t } = useTranslation()
  const currentPosition = useOrderStore(
    (state) => state.currentPosition,
    shallow
  )
  const ref = useRef<BottomSheetBase>(null)

  const { stopProfitPrice, stopLossPrice, enableCloseLoss, enableCloseProfit } =
    useProfitAndLossStore((state) => state)
  const futuresOrder: FuturesOrder = useMemo(
    () => ({
      linkFuturesCode: currentPosition?.linkFuturesCode,
      position: currentPosition?.position,
      openSafe: currentPosition?.openSafe,
      clazzSpread: currentPosition?.clazzSpread,
      volatility: currentPosition?.volatility ?? 0.01,
      tradingFee: currentPosition?.tradingFee,
      overNightFee: currentPosition?.overNightFee,
      multiplier: currentPosition?.multiplier,
      price: currentPosition?.price,
      futuresCode: currentPosition?.futuresCode,
      overPrice: currentPosition?.overPrice,
      computeType: currentPosition?.computeType,
    }),
    [currentPosition]
  )
  useEffect(() => {
    useProfitAndLossStore.setState({
      stopLossPrice: currentPosition?.stopLossPrice ?? 0,
      stopProfitPrice: currentPosition?.stopProfitPrice ?? 0,
      enableCloseProfit: !!currentPosition?.stopProfitPrice,
      enableCloseLoss: !!currentPosition?.stopLossPrice,
    })
  }, [currentPosition])
  useUnmount(() => {
    useProfitAndLossStore.setState({
      stopProfitPrice: undefined,
      stopLossPrice: undefined,
      enableCloseProfit: undefined,
      enableCloseLoss: undefined,
    })
  })
  return (
    <Fragment>
      <Collapse
        expended={enableCloseProfit}
        toggleExpended={(enableCloseProfit) => {
          useProfitAndLossStore.setState({
            enableCloseProfit,
            stopProfitPrice: currentPosition?.stopProfitPrice
              ? currentPosition.stopProfitPrice
              : (currentPosition?.price ?? 0),
          })
        }}
        title={
          <XStack gap="$xs" ai="center">
            <Text fow="700">{t("trade.closeProfit")}</Text>
            <XStack
              hitSlop={16}
              onPress={() => {
                useStore.setState({
                  title: t("trade.closeProfit"),
                  desc: t("trade.closeProfitDesc"),
                })
                ref.current?.expand()
              }}
            >
              <Icon name="info" size={12}></Icon>
            </XStack>
          </XStack>
        }
      >
        <YStack gap="$sm">
          <Input.Digit
            value={stopProfitPrice}
            precision={
              futuresOrder.volatility!.toString().split(".")[1]?.length
            }
            step={futuresOrder.volatility! * 100}
            onChange={(stopProfitPrice) => {
              useProfitAndLossStore.setState({
                stopProfitPrice,
              })
            }}
          />
          <ProfitTracker current={stopProfitPrice} order={futuresOrder} />
        </YStack>
      </Collapse>
      <Collapse
        expended={enableCloseLoss}
        toggleExpended={(enableCloseLoss) => {
          useProfitAndLossStore.setState({
            enableCloseLoss,
            stopLossPrice: currentPosition?.stopLossPrice
              ? currentPosition.stopLossPrice
              : (currentPosition?.price ?? 0),
          })
        }}
        title={
          <XStack gap="$xs" ai="center">
            <Text fow="700">{t("trade.closeLoss")}</Text>
            <XStack
              hitSlop={16}
              onPress={() => {
                useStore.setState({
                  title: t("trade.closeLoss"),
                  desc: t("trade.closeLossDesc"),
                })
                ref.current?.expand()
              }}
            >
              <Icon name="info" size={12}></Icon>
            </XStack>
          </XStack>
        }
      >
        <YStack gap="$sm">
          <Input.Digit
            value={stopLossPrice}
            precision={
              futuresOrder.volatility!.toString().split(".")[1]?.length
            }
            step={futuresOrder.volatility! * 100}
            onChange={(stopLossPrice) => {
              useProfitAndLossStore.setState({ stopLossPrice })
            }}
          />
          <ProfitTracker current={stopLossPrice} order={futuresOrder} />
        </YStack>
      </Collapse>
    </Fragment>
  )
}
