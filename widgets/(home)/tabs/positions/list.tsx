import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useInfiniteScroll } from 'ahooks'
import { FC, Fragment, ReactNode, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Platform, RefreshControl } from 'react-native'
import { XStack, XStackProps, YStack } from 'tamagui'
import { shallow } from 'zustand/shallow'

import { getClosedPositions, getOpenPositions, getPendingPositions } from '~/api/trade'
import { AnimatedFlow, Figure, Icon, Text } from '~/components'
import { getRecentDate } from '~/hooks/useLocale'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { computeProfit, useOrderStore, useQuotesStore } from '~/hooks/useStore'
import { dayjs, DEVICE_WIDTH, formatDecimal } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'

export const PriceCell: FC<{ data: Position }> = ({ data }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const diff = useMemo(
    () => ((data.volatility ?? 0) * (data.clazzSpread ?? 0)) / 2,
    [data.volatility, data.clazzSpread]
  )
  return (
    <AnimatedFlow
      value={
        ((data.openSafe === 0 ? quotes?.Bid : quotes?.Ask) ??
          data.overPrice ??
          data.lastPrice ??
          data.price) - (data.openSafe! === 0 ? diff : -diff)
      }
      fraction={data.volatility}
    ></AnimatedFlow>
  )
}

export const ProfitCell: FC<{ data: Position }> = ({ data }) => {
  // @ts-ignore next-line
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!],
    shallow
  )
  const profit = computeProfit(data)
  return <AnimatedFlow value={profit} addonsBefore="$"></AnimatedFlow>
}

const ListItem: FC<
  {
    data: Position
    children: ReactNode
  } & XStackProps
> = ({ data, children, ...rest }) => {
  return (
    <XStack h={72} ai="center" px="$md" w="100%" gap={12} {...rest}>
      {children}
      <XStack f={1} jc="flex-end">
        <XStack
          onPress={() => {
            useOrderStore.setState({ currentPosition: data })
          }}
          hitSlop={16}
        >
          <Icon name="chevronRight" size={20} color={colors.secondary} />
        </XStack>
      </XStack>
    </XStack>
  )
}

const EditableListItem: FC<{ data: Position }> = ({ data }) => {
  const { t } = useTranslation()
  const withTPSL = useMemo(
    () => data.stopLossPrice && data.stopProfitPrice,
    [data.stopLossPrice, data.stopProfitPrice]
  )
  return (
    <ListItem data={data}>
      <XStack
        hitSlop={16}
        onPress={() => {
          useOrderStore.setState({ willClosePosition: data })
        }}
      >
        <Icon name="close" size={16} color={colors.secondary} />
      </XStack>
      <YStack f={1} gap="$sm">
        <Text fow="900">{data.futuresCode}</Text>
        <AnimatedFlow
          addonsBefore="$"
          value={data.profit ?? 0}
          fow="900"
        ></AnimatedFlow>
      </YStack>
      <YStack gap="$sm" f={1}>
        <XStack ai="center" gap="$sm">
          <Text>{`${t(data.openSafe ? "positions.sell" : "positions.buy")} ${data.position} ${t("positions.lots")}`}</Text>
          {data.stopProfitPrice ? (
            <Text
              fos={10}
              bc={toRGBA(colors.primary, 0.1)}
              col="$primary"
              p={2}
              br={2}
            >
              TP
            </Text>
          ) : null}
          {data.stopLossPrice ? (
            <Text
              fos={10}
              bc={toRGBA(colors.destructive, 0.1)}
              col="$destructive"
              p={2}
              br={2}
            >
              SL
            </Text>
          ) : null}
        </XStack>
        {withTPSL ? (
          <XStack ai="center" gap="$xs" jc="center">
            <Text col="$secondary">
              {formatDecimal(
                data.stopLossPrice ?? data.price!,
                data.volatility
              )}
            </Text>
            <XStack rotate="180deg">
              <Icon name="arrowLeft" color={colors.secondary} size={12} />
            </XStack>
            <Text col="$secondary">
              {formatDecimal(
                data.stopProfitPrice ?? data.price!,
                data.volatility
              )}
            </Text>
          </XStack>
        ) : null}
      </YStack>
    </ListItem>
  )
}

const ArchivedListItem: FC<{ data: Position; dateVisible?: boolean }> = ({
  data,
  dateVisible,
}) => {
  const { t } = useTranslation()
  return (
    <Fragment>
      {dateVisible ? (
        <YStack px="$md" pt="$sm" w="100%">
          <Text fos={11} col="$secondary">
            {getRecentDate(data.createTime)}
          </Text>
        </YStack>
      ) : null}
      <ListItem data={data} h={64} gap={32}>
        <YStack gap="$sm">
          <Text fow="900">{data.futuresCode}</Text>
          <Text col="$secondary">
            {dayjs(data.createTime).format("MMM DD, YYYY HH:mm")}
          </Text>
        </YStack>
        <YStack gap="$sm" f={1}>
          <Text
            fow="900"
            col={
              data.profit! > 0
                ? "$primary"
                : data.profit! < 0
                  ? "$destructive"
                  : "$secondary"
            }
          >
            ${data.profit! > 0 ? "+" : ""}
            {formatDecimal(data.profit ?? 0)}
          </Text>
          <Text col="$secondary">{`${t(data.openSafe ? "positions.sell" : "positions.buy")} ${data.position} ${t("positions.lots")}`}</Text>
        </YStack>
      </ListItem>
    </Fragment>
  )
}

const renderItem = ({ item }: { item: Position }) => (
  <EditableListItem data={item} />
)

const keyExtractor = (item: Position) => item.orderSn!.toString()

const ListEmptyComponent: FC<{ loading: boolean }> = ({ loading }) => {
  const { t } = useTranslation()
  if (loading) {
    return (
      <YStack ai="center" jc="center" h="100%" gap="$md">
        <ActivityIndicator color={colors.tertiary} />
      </YStack>
    )
  }
  return (
    <YStack ai="center" jc="center" h="100%" gap="$md">
      <Figure name="empty" width={90} height={90} />
      <Text col="$secondary">{t("notifications.emptySystem")}</Text>
    </YStack>
  )
}

export const OpenOrders = () => {
  const data = useOrderStore((state) => state.orders, shallow)
  const { loading } = useRequest(getOpenPositions, {
    cacheKey: CACHE_KEY.POSITIONS,
  })
  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={72}
        keyExtractor={keyExtractor}
        overrideProps={{
          contentContainerStyle: {
            flexGrow: 1,
          },
        }}
        ListEmptyComponent={() => <ListEmptyComponent loading={loading} />}
      ></FlashList>
    </YStack>
  )
}

export const PendingOrders = () => {
  const data = useOrderStore((state) => state.pendingOrders, shallow)
  const { loading } = useRequest(getPendingPositions, {
    cacheKey: CACHE_KEY.PENDING,
  })
  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={72}
        keyExtractor={keyExtractor}
        overrideProps={{
          contentContainerStyle: {
            flexGrow: 1,
          },
        }}
        ListEmptyComponent={() => <ListEmptyComponent loading={loading} />}
      ></FlashList>
    </YStack>
  )
}

export const ClosedOrders = () => {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const { reloadKey } = useOrderStore((state) => state, shallow)
  const { data, loading, loadMore, reload, loadingMore } = useInfiniteScroll<{
    list: Position[]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }
      return getClosedPositions({
        currentPage: d?.nextId ?? 1,
        startTime: useOrderStore.getState().from,
        endTime: useOrderStore.getState().to,
      })
    },
    {
      reloadDeps: [isFocused, reloadKey],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  const ListFooterComponent = useCallback(() => {
    if (!data?.list.length) return null
    return (
      <XStack
        gap="$md"
        p="$md"
        ai="center"
        w="100%"
        jc="center"
        pb={loading || loadingMore ? "$md" : 0}
      >
        {loading || loadingMore ? (
          <ActivityIndicator color={colors.tertiary} />
        ) : null}
        <Text col="$tertiary" fow="700">
          {loading
            ? t("home.loading")
            : loadingMore
              ? t("home.loadingMore")
              : ""}
        </Text>
      </XStack>
    )
  }, [loading, loadingMore, t, data?.list.length])

  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlashList
        data={data?.list}
        renderItem={({ item, index }) => (
          <ArchivedListItem
            data={item}
            dateVisible={
              dayjs(item.createTime).format("YYYY-MM-DD") !==
              dayjs(data?.list?.[index - 1]?.createTime).format("YYYY-MM-DD")
            }
          />
        )}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            tintColor={colors.secondary}
            refreshing={loading}
            onRefresh={reload}
          />
        }
        estimatedItemSize={72}
        onRefresh={reload}
        keyExtractor={keyExtractor}
        overrideProps={{
          contentContainerStyle: {
            flexGrow: 1,
          },
        }}
        onEndReached={loadMore}
        ListEmptyComponent={() => <ListEmptyComponent loading={loading} />}
        ListFooterComponent={ListFooterComponent}
      ></FlashList>
    </YStack>
  )
}
