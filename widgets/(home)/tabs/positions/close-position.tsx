import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { router, useSegments } from 'expo-router'
import { FC, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import { cancelOrder, proceedOrder } from '~/api/trade'
import { BottomSheet, Button, Text, toast, XStack, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useOrderStore, useQuotesStore } from '~/hooks/useStore'
import { computeWallet, subscribeQuotes } from '~/hooks/useWebsocket'
import { PriceCell } from '~/widgets/shared/price-cell'
import { ProfitCell } from '~/widgets/shared/profit-cell'

export const ClosePosition: FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const segments = useSegments()
  const position = useOrderStore((state) => state.willClosePosition, shallow)
  const onPositionClosed = useCallback(() => {
    const order = useOrderStore
      .getState()
      .orders?.find((it) => it.id === position?.id)
    computeWallet(order)
    useOrderStore.setState({
      willClosePosition: undefined,
      pendingOrders: useOrderStore
        .getState()
        .pendingOrders?.filter((it) => it.id !== position?.id),
    })
    toast.show(t("message.closePositionSuccess"))
    if (segments.some((it) => ["order", "position"].includes(it))) {
      router.back()
    }
  }, [position?.id, segments, t])
  const { run, loading } = useRequest(proceedOrder, {
    manual: true,
    onSuccess: onPositionClosed,
    onFinally: () => {
      ref.current?.dismiss()
    },
  })
  const { run: cancel, loading: cancelling } = useRequest(cancelOrder, {
    manual: true,
    onSuccess: onPositionClosed,
    onFinally: () => {
      ref.current?.dismiss()
    },
  })
  const ref = useRef<BottomSheetModal>(null)
  useEffect(() => {
    if (position) {
      const quote = useQuotesStore.getState().quotes[position.futuresCode!]
      if (!quote) {
        subscribeQuotes([position?.futuresCode, position?.linkFuturesCode])
      }
      ref.current?.present()
    } else {
      ref.current?.dismiss()
    }
  }, [position])
  if (!position) return null
  return (
    <BottomSheet
      ref={ref}
      index={0}
      title={t("positions.close", { code: position?.futuresShow ?? "" })}
      onDismiss={() => {
        useOrderStore.setState({ willClosePosition: undefined })
      }}
    >
      <YStack px="$md" pb={bottom + 16}>
        <XStack ai="center" jc="space-between" py={12}>
          <Text caption col="$secondary">
            {t("trade.volume")}
          </Text>
          <Text>{position?.position ?? 0}</Text>
        </XStack>
        <XStack ai="center" jc="space-between" py={12}>
          <Text caption col="$secondary">
            {t("trade.currentPrice")}
          </Text>
          {position ? <PriceCell data={position} /> : null}
        </XStack>
        <XStack ai="center" jc="space-between" py={12}>
          <Text caption col="$secondary">
            {t("trade.profitLoss")}
          </Text>
          {position ? <ProfitCell data={position} /> : null}
        </XStack>
        <Button
          mt="$md"
          isLoading={loading || cancelling}
          onPress={() => {
            if (activeIndex === 0 && position?.futuresId && position.id) {
              run({
                futuresId: position?.futuresId,
                byOrSell: position.type as 0 | 1 | 7,
                positions: {
                  id: position.id,
                },
              })
            }
            if (activeIndex === 1 && position?.id) {
              cancel({
                positionsId: position.id,
                cancelPrice: position.price!,
              })
            }
          }}
        >
          {t("positions.closePosition")}
        </Button>
      </YStack>
    </BottomSheet>
  )
}
