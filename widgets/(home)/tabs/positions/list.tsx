import { useIsFocused } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { useInfiniteScroll } from "ahooks"
import { router } from "expo-router"
import { FC, Fragment, ReactNode, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Platform, RefreshControl } from "react-native"
import { XStackProps } from "tamagui"
import { shallow } from "zustand/shallow"

import {
  getClosedPositions,
  getOpenPositions,
  getPendingPositions,
} from "~/api/trade"
import { AnimatedFlow, Figure, Icon, Text, XStack, YStack } from "~/components"
import { getRecentDate } from "~/hooks/useLocale"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useOrderStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { dayjs, DEVICE_WIDTH, formatDecimal, uuid } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"
import { PriceCell } from "~/widgets/shared/price-cell"

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
            useOrderStore.setState({
              currentPosition: data,
            })
            router.push("/order")
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
        <XStack ai="center" gap="$xs" jc="center">
          <Text col="$secondary" ff="$mono">
            {formatDecimal(data.price!, data.volatility)}
          </Text>
          <XStack rotate="180deg">
            <Icon name="arrowLeft" color={colors.secondary} size={12} />
          </XStack>
          <PriceCell col="$secondary" data={data} />
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

const keyExtractor = (item: Position) => item.orderSn!.toString()

const ListEmptyComponent: FC<{
  loading: boolean
  type: "open" | "orders" | "closed"
}> = ({ loading, type }) => {
  const { t } = useTranslation()
  const filtered = useOrderStore(
    (state) => state.from || state.to || state.options,
    shallow
  )
  if (loading) {
    return (
      <YStack ai="center" jc="center" h="100%" gap="$md">
        <Text>{t("home.loading")}</Text>
      </YStack>
    )
  }
  return (
    <YStack ai="center" jc="center" h="100%" gap="$md" px={48}>
      <Figure name="empty" width={90} height={90} />
      <Text>
        {t(
          type === "open"
            ? "positions.noOpenPositions"
            : type === "orders"
              ? "positions.noPendingPositions"
              : "positions.noClosedPositions"
        )}
      </Text>
      <Text fos={11} ta="center" col="$tertiary">
        {t(
          type === "open"
            ? "positions.noOpenPositionsDesc"
            : type === "orders"
              ? "positions.noPendingPositionsDesc"
              : "positions.noClosedPositionsDesc"
        )}
      </Text>
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
            fos={11}
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
            fos={11}
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
        refreshing={loading}
        refreshControl={
          <RefreshControl
            tintColor={colors.secondary}
            refreshing={loading}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="open" />
        )}
      ></FlashList>
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
        refreshing={loading}
        refreshControl={
          <RefreshControl
            tintColor={colors.secondary}
            refreshing={loading}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="orders" />
        )}
      ></FlashList>
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
        <AnimatedFlow value={profit} addonsBefore="$" fow="900"></AnimatedFlow>
      </XStack>
    </XStack>
  )
}

export const ClosedOrders = () => {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
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
              index === 0 ||
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
        ListHeaderComponent={() => (
          <ListHeaderComponent isEmpty={!data?.list.length} />
        )}
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type="closed" />
        )}
        ListFooterComponent={ListFooterComponent}
      ></FlashList>
    </YStack>
  )
}
