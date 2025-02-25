import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { router, useSegments } from "expo-router"
import { FC, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import { cancelOrder, proceedOrder } from "~/api/trade"
import { BottomSheet, Button, Text, XStack, YStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useOrderStore, useQuotesStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { uuid, waitFor } from "~/lib/utils"
import { PriceCell } from "~/widgets/shared/price-cell"
import { ProfitCell } from "~/widgets/shared/profit-cell"

const updateOrderState = () => {
  if (useOrderStore.getState().activeIndex === 0) {
    waitFor(500).then(() => useOrderStore.setState({ reloadKey: uuid() }))
  }
  if (useOrderStore.getState().activeIndex === 1) {
    router.back()
  }
}

export const ClosePosition: FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const segments = useSegments()
  const position = useOrderStore((state) => state.willClosePosition, shallow)
  const { run, loading } = useRequest(proceedOrder, {
    manual: true,
    onSuccess: () => {
      if (segments.some((it) => it.includes("order"))) {
        updateOrderState()
      }
    },
    onFinally: () => {
      ref.current?.dismiss()
    },
  })
  const { run: cancel, loading: cancelling } = useRequest(cancelOrder, {
    manual: true,
    onSuccess: () => {
      if (segments.some((it) => it.includes("order"))) {
        updateOrderState()
      }
    },
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
      title={t("positions.close", { code: position?.futuresCode ?? "" })}
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
