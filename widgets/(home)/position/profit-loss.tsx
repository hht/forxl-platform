import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useUnmount } from "ahooks"
import { Fragment, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { Collapse, Icon, Input, Text, XStack, YStack } from "~/components"
import { useOrderStore, usePromptStore } from "~/hooks/useStore"
import { uuid } from "~/lib/utils"
import { ProfitTracker } from "~/widgets/(home)/tabs/positions/profit-tracker"

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
  const ref = useRef<BottomSheetModal>(null)

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
            stopProfitPrice: enableCloseProfit
              ? currentPosition?.stopProfitPrice
                ? currentPosition.stopProfitPrice
                : (currentPosition?.price ?? 0)
              : undefined,
          })
        }}
        title={
          <XStack gap="$xs" ai="center">
            <Text bold>{t("trade.closeAtProfit")}</Text>
            <XStack
              hitSlop={16}
              onPress={() => {
                usePromptStore.setState({
                  title: t("trade.closeAtProfit"),
                  desc: t("trade.closeProfitDesc"),
                  reloadKey: uuid(),
                })
                ref.current?.dismiss()
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
            stopLossPrice: enableCloseLoss
              ? currentPosition?.stopLossPrice
                ? currentPosition.stopLossPrice
                : (currentPosition?.price ?? 0)
              : undefined,
          })
        }}
        title={
          <XStack gap="$xs" ai="center">
            <Text bold>{t("trade.closeAtLoss")}</Text>
            <XStack
              hitSlop={16}
              onPress={() => {
                usePromptStore.setState({
                  title: t("trade.closeAtLoss"),
                  desc: t("trade.closeLossDesc"),
                  reloadKey: uuid(),
                })
                ref.current?.present()
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
