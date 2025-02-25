import { FC, Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStackProps } from 'tamagui'
import { shallow } from 'zustand/shallow'

import { AnimatedFlow, Button, Icon, Text, XStack, YStack } from '~/components'
import { getDate } from '~/hooks/useLocale'
import { useQuotesStore } from '~/hooks/useStore'
import { formatDecimal } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'

const FutureInfo: FC<{ onPress?: () => void }> = ({ onPress }) => {
  const { t } = useTranslation()
  const { quotes, currentFuture } = useQuotesStore(
    (state) => ({
      currentFuture: state.currentFuture,
      quotes: state.quotes[state.currentFuture?.futuresCode!],
    }),
    shallow
  )
  const diff = useMemo(
    () =>
      ((currentFuture?.volatility ?? 0) * (currentFuture?.clazzSpread ?? 0)) /
      2,
    [currentFuture?.volatility, currentFuture?.clazzSpread]
  )
  if (!currentFuture || !quotes) {
    return null
  }
  const buyPrice = (quotes?.Ask ?? currentFuture.buyPrice) + diff
  const sellPrice = (quotes?.Bid ?? currentFuture.sellPrice) - diff

  if (currentFuture.isDeal) {
    return (
      <Fragment>
        <Button
          type="accent"
          f={1}
          onPress={() => {
            useQuotesStore.setState({
              action: "buy",
              order: {
                position: 0.01,
              },
            })
            onPress?.()
          }}
        >
          <YStack ai="center" jc="center">
            <Text bold>{t("trade.buy")}</Text>
            <AnimatedFlow
              value={quotes.Ask ? buyPrice : Number(currentFuture.buyPrice)}
              fraction={currentFuture.volatility}
              bold
              color={
                quotes?.AskDiff > 0
                  ? colors.primary
                  : quotes?.AskDiff < 0
                    ? colors.destructive
                    : colors.secondary
              }
            />
          </YStack>
        </Button>
        <Button
          type="accent"
          f={1}
          onPress={() => {
            useQuotesStore.setState({
              action: "sell",
              order: {
                position: 0.01,
              },
            })
            onPress?.()
          }}
        >
          <YStack ai="center" jc="center">
            <Text bold>{t("trade.sell")}</Text>
            <AnimatedFlow
              color={
                quotes?.BidDiff > 0
                  ? colors.primary
                  : quotes?.BidDiff < 0
                    ? colors.destructive
                    : colors.secondary
              }
              bold
              value={quotes.Bid ? sellPrice : Number(currentFuture.sellPrice)}
              fraction={currentFuture.volatility}
            />
          </YStack>
        </Button>
      </Fragment>
    )
  }
  return null
}

export const MarketInfo: FC<
  {
    future: FuturesDetail
    onPress?: () => void
  } & Omit<XStackProps, "onPress">
> = ({ future, onPress, ...rest }) => {
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()
  const currentFuture = useQuotesStore((state) => state.currentFuture)

  if (currentFuture?.isDeal) {
    return (
      <XStack ai="center" p="$md" gap={12} pb={bottom + 16}>
        <FutureInfo onPress={onPress} />
      </XStack>
    )
  }
  const openTime = future.futuresTimeList?.[0]?.openTimestamp
  return (
    <YStack bc="$card" ai="center" p="$md" gap={12} pb={bottom + 16} {...rest}>
      {openTime ? (
        <XStack ai="center" gap="$xs">
          <Icon name="moon" size={12}></Icon>
          <Text caption col="$secondary">
            {t("trade.openOn", {
              date: getDate(openTime).format("YYYY/MM/DD HH:mm:ss"),
            })}
          </Text>
        </XStack>
      ) : null}
      <XStack gap={12} w="100%">
        <Button type="accent" disabled f={1}>
          <YStack ai="center" jc="center">
            <Text col={toRGBA(colors.text, 0.4)} bold>
              {t("trade.buy")}
            </Text>
            <Text col={toRGBA(colors.text, 0.4)} bold>
              {formatDecimal(
                future.market?.buyPrice ?? 0,
                currentFuture?.volatility
              )}
            </Text>
          </YStack>
        </Button>
        <Button type="accent" disabled f={1}>
          <YStack ai="center" jc="center">
            <Text col={toRGBA(colors.text, 0.4)} bold>
              {t("trade.sell")}
            </Text>
            <Text col={toRGBA(colors.text, 0.4)} bold>
              {formatDecimal(
                future.market?.sellPrice ?? 0,
                currentFuture?.volatility
              )}
            </Text>
          </YStack>
        </Button>
      </XStack>
    </YStack>
  )
}
