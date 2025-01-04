import BottomSheetBase from '@gorhom/bottom-sheet'
import { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import { PriceCell, ProfitCell } from './list'

import { cancelOrder, proceedOrder } from '~/api/trade'
import { BottomSheet, Button, Text, XStack, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useOrderStore, useQuotesStore } from '~/hooks/useStore'
import { subscribeQuotes } from '~/hooks/useWebsocket'

export const ClosePosition: FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const position = useOrderStore((state) => state.willClosePosition, shallow)
  const { run, loading } = useRequest(proceedOrder, {
    manual: true,
    onSuccess: () => {
      useOrderStore.setState({ willClosePosition: undefined })
    },
  })
  const { run: cancel, loading: cancelling } = useRequest(cancelOrder, {
    manual: true,
    onSuccess: () => {
      useOrderStore.setState({ willClosePosition: undefined })
    },
  })
  const ref = useRef<BottomSheetBase>(null)
  useEffect(() => {
    if (position) {
      const quote = useQuotesStore.getState().quotes[position.futuresCode!]
      if (!quote) {
        subscribeQuotes([position?.futuresCode, position?.linkFuturesCode])
      }
      ref.current?.expand()
    } else {
      ref.current?.close()
    }
  }, [position])
  return (
    <BottomSheet
      ref={ref}
      title={t("positions.close", { code: position?.futuresCode ?? "" })}
      onClose={() => {
        useOrderStore.setState({ willClosePosition: undefined })
      }}
    >
      <YStack px="$md" pb={bottom + 16}>
        <XStack ai="center" jc="space-between" py={12}>
          <Text fos={11} col="$secondary">
            {t("positions.volume")}
          </Text>
          <Text>{position?.position ?? 0}</Text>
        </XStack>
        <XStack ai="center" jc="space-between" py={12}>
          <Text fos={11} col="$secondary">
            {t("positions.currentPrice")}
          </Text>
          {position ? <PriceCell data={position} /> : null}
        </XStack>
        <XStack ai="center" jc="space-between" py={12}>
          <Text fos={11} col="$secondary">
            {t("positions.pl")}
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
