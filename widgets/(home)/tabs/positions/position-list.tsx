import { useIsFocused } from '@react-navigation/native'
import { useInfiniteScroll } from 'ahooks'
import { router } from 'expo-router'
import { FC, Fragment, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, RefreshControl } from 'react-native'
import { XStackProps } from 'tamagui'
import { shallow } from 'zustand/shallow'

import { getClosedPositions, getOpenPositions, getPendingPositions } from '~/api/trade'
import { AnimatedFlow, Figure, Icon, Row, Text, XStack, YStack } from '~/components'
import { getDate, getRecentDate } from '~/hooks/useLocale'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useOrderStore, useQuotesStore, useSymbolStore } from '~/hooks/useStore'
import { subscribeQuotes } from '~/hooks/useWebsocket'
import { dayjs, DEVICE_WIDTH, formatDecimal, formatProfit, uuid } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'
import { ListFooterComponent } from '~/widgets/shared/list'
import { PriceCell } from '~/widgets/shared/price-cell'
import { ProfitCell } from '~/widgets/shared/profit-cell'

const ListItem: FC<
  {
    data: Position
    children: ReactNode
  } & XStackProps
> = ({ data, children, ...rest }) => {
  return (
    <XStack h={72} ai="center" px="$md" w="100%" gap={12} {...rest}>
      {children}
      <XStack jc="flex-end">
        <XStack
          onPress={() => {
            useOrderStore.setState({
              currentPosition: data,
            })
            router.push("/position")
          }}
          hitSlop={16}
        >
          <Icon name="chevronRight" size={20} color={colors.secondary} />
        </XStack>
      </XStack>
    </XStack>
  )
}

const EditableListItem: FC<{ data: Position, disableProfit?: boolean }> = ({ data, disableProfit }) => {
  const { t } = useTranslation()
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
      <YStack
        f={1}
        gap="$sm"
        onPress={() => {
          useQuotesStore.setState({
            currentFuture: { ...useQuotesStore.getState().currentFuture, ...data } as Future,
          })
          useSymbolStore.setState({
            currentSymbol:
              useSymbolStore.getState().currentSymbol?.symbol ===
                data.futuresCode
                ? undefined
                : { symbol: data.futuresCode!, volatility: data.volatility! },
          })
        }}
      >
        <Text bold>{data.futuresShow}</Text>
        {disableProfit ? <Row gap="$sm">
          <Text>-</Text>
          <Text>-</Text>
        </Row> : <ProfitCell data={data} bold />}
      </YStack>
      <YStack gap="$sm" f={1} ai="flex-start">
        <XStack ai="center" gap="$sm">
          <Text>{`${t(data.openSafe ? "trade.sell" : "trade.buy")} ${data.position} ${t("trade.lots", { amount: "" })}`}</Text>
          {data.stopProfitPrice ? (
            <Text
              fos={10}
              bc={toRGBA(colors.primary, 0.1)}
              col="$primary"
              px={2}
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
              px={2}
              br={2}
            >
              SL
            </Text>
          ) : null}
        </XStack>
        <XStack ai="center" gap="$xs">
          <Text col="$secondary">
            {formatDecimal(data.price!, data.volatility)}
          </Text>
          <XStack rotate="180deg">
            <Icon name="arrowLeft" color={colors.secondary} size={12} />
          </XStack>
          <PriceCell color={colors.secondary} data={data} />
        </XStack>
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
          <Text caption col="$secondary">
            {getRecentDate(data.overTime)}
          </Text>
        </YStack>
      ) : null}
      <ListItem data={data} h={64} gap={32}>
        <YStack
          gap="$sm"
          onPress={() => {
            useQuotesStore.setState({
              currentFuture: { ...useQuotesStore.getState().currentFuture, ...data } as Future,
            })
            useSymbolStore.setState({
              currentSymbol:
                useSymbolStore.getState().currentSymbol?.symbol ===
                  data.futuresCode
                  ? undefined
                  : { symbol: data.futuresCode!, volatility: data.volatility! },
            })
          }}
        >
          <Text bold>{data.futuresShow}</Text>
          <Text col="$secondary">
            {getDate(data.overTime).format("MMM DD, YYYY HH:mm")}
          </Text>
        </YStack>
        <YStack gap="$sm" f={1}>
          {data.cancelTime ? (
            <Text bold col="$secondary">
              -
            </Text>
          ) : (
            <Row ai="baseline" gap="$xs">
              <Text
                bold
                col={
                  data.pureProfit! > 0
                    ? "$primary"
                    : data.pureProfit! < 0
                      ? "$destructive"
                      : "$secondary"
                }
              >
                {formatProfit(data.pureProfit ?? 0)}
              </Text>
              <Text
                bold
                fos={10}
                lh={10}
                col={
                  data.pureProfit! > 0
                    ? "$primary"
                    : data.pureProfit! < 0
                      ? "$destructive"
                      : "$secondary"
                }
              >
                {formatDecimal(
                  ((data.pureProfit ?? 0) / (data.securityDeposit ?? 1)) * 100
                )}
                %
              </Text>
            </Row>
          )}
          <Text col="$secondary">{`${t(data.openSafe ? "trade.sell" : "trade.buy")} ${data.position} ${t("trade.lots", { amount: "" })}`}</Text>
        </YStack>
      </ListItem>
    </Fragment>
  )
}

const keyExtractor = (item: Position) => item.orderSn!.toString()

const ListEmptyComponent: FC<{
  loading: boolean
  type: "open" | "orders" | "closed"
}> = ({ loading, type }) => {
  const { t } = useTranslation()
  const { from, to, options } = useOrderStore((state) => state, shallow)
  if (loading) {
    return null
  }
  const filtered = from || to || options
  return (
    <YStack ai="center" jc="center" h="100%" gap="$md" px={48}>
      <Figure name="empty" width={90} height={90} />
      <Text ta="center">
        {t(
          type === "open"
            ? "trade.openPositionEmptyTitle"
            : type === "orders"
              ? "trade.pendingPositionEmptyTitle"
              : "trade.closedPositionEmptyTitle",
          {
            period:
              type === "closed" && options
                ? options === "customPeriod"
                  ? `${getDate(from).format(
                    "MM/DD/YYYY"
                  )} - ${getDate(to).format("MM/DD/YYYY")}`
                  : t(`positions.${options}`)
                : t("positions.lastYear"),
          }
        )}
      </Text>
      {type === "closed" && filtered ? null : (
        <Text caption ta="center" col="$tertiary">
          {t(
            type === "open"
              ? "trade.openPositionEmptyDesc"
              : type === "closed"
                ? "trade.closedPositionEmptyDesc"
                : "trade.pendingPositionEmptyDesc"
          )}
        </Text>
      )}
      {type === "closed" && filtered ? (
        <XStack
          hitSlop={16}
          onPress={() => {
            useOrderStore.setState({
              from: undefined,
              to: undefined,
              options: undefined,
              reloadKey: uuid(),
            })
          }}
        >
          <Text
            caption
            col="$warning"
            textDecorationStyle="solid"
            textDecorationLine="underline"
            textDecorationColor={colors.warning}
          >
            {t("positions.clear")}
          </Text>
        </XStack>
      ) : null}
      {type !== "closed" ? (
        <XStack
          hitSlop={16}
          onPress={() => {
            router.push("/tabs/trade")
          }}
        >
          <Text
            caption
            col="$primary"
            textDecorationStyle="solid"
            textDecorationLine="underline"
            textDecorationColor={colors.primary}
          >
            {t("positions.gotoTrade")}
          </Text>
        </XStack>
      ) : null}
    </YStack>
  )
}

const renderItem = ({ item }: { item: Position }) => (
  <EditableListItem data={item} />
)

const renderPendingItem = ({ item }: { item: Position }) => (
  <EditableListItem disableProfit data={item} />
)
export const OpenOrders = () => {
  const data = useOrderStore((state) => state.orders, shallow)
  const { loading, refresh } = useRequest(getOpenPositions, {
    cacheKey: CACHE_KEY.POSITIONS,
    onSuccess: (orders) => {
      subscribeQuotes(orders.map((o) => o.futuresCode!))
    },
  })

  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            colors={[colors.secondary]}
            progressBackgroundColor={colors.card}
            refreshing={loading}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="open" />
        )}
      ></FlatList>
    </YStack>
  )
}

export const PendingOrders = () => {
  const data = useOrderStore((state) => state.pendingOrders, shallow)
  const { loading, refresh } = useRequest(getPendingPositions, {
    cacheKey: CACHE_KEY.PENDING,
    onSuccess: (orders) => {
      subscribeQuotes(orders.map((o) => o.futuresCode!))
    },
  })

  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlatList
        data={data}
        renderItem={renderPendingItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            colors={[colors.secondary]}
            progressBackgroundColor={colors.card}
            refreshing={loading}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="orders" />
        )}
      ></FlatList>
    </YStack>
  )
}

const ListHeaderComponent: FC<{ isEmpty?: boolean }> = ({ isEmpty }) => {
  const profit = useOrderStore((state) => state.totalProfit ?? 0, shallow)
  if (isEmpty) return null
  return (
    <XStack p="$md" gap="$md" ai="center" jc="center">
      <XStack
        w="100%"
        boc="$border"
        bw={1}
        br="$sm"
        py={12}
        bc="$card/60"
        jc="center"
      >
        <AnimatedFlow value={profit} addonsBefore="$" bold></AnimatedFlow>
      </XStack>
    </XStack>
  )
}

export const ClosedOrders = () => {
  const isFocused = useIsFocused()
  const reloadKey = useOrderStore((state) => state.reloadKey, shallow)
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
      reloadDeps: [reloadKey],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )

  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <FlatList
        data={data?.list}
        renderItem={({ item, index }) => (
          <ArchivedListItem
            data={item}
            dateVisible={
              index === 0 ||
              dayjs(item.overTime).format("YYYY-MM-DD") !==
              dayjs(data?.list?.[index - 1]?.overTime).format("YYYY-MM-DD")
            }
          />
        )}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            colors={[colors.secondary]}
            progressBackgroundColor={colors.card}
            onRefresh={reload}
          />
        }
        onRefresh={reload}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onEndReached={loadMore}
        ListHeaderComponent={() => (
          <ListHeaderComponent isEmpty={!data?.list.length} />
        )}
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="closed" />
        )}
        ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
      ></FlatList>
    </YStack>
  )
}
