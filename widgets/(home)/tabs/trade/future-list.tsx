import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll } from "ahooks"
import { router } from "expo-router"
import { FC, useCallback, useEffect, useMemo } from "react"
import { FlatList, Platform, RefreshControl } from "react-native"
import { shallow } from "zustand/shallow"

import { FutureCategories } from "./categories"

import { getFutures } from "~/api/trade"
import { AnimatedFlow, Icon, Text, XStack, YStack } from "~/components"
import { useForxlStore, useQuotesStore, useSymbolStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { DEVICE_WIDTH, t } from "~/lib/utils"
import colors from "~/theme/colors"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

const Momentum: FC<{
  data?: Future
}> = ({ data }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data?.futuresCode!],
    shallow
  )
  if (!data || !data.isDeal || !data.lastClosePrice || !quotes?.Bid) {
    return (
      <XStack>
        <Text col="$secondary" bold>
          0.00%
        </Text>
      </XStack>
    )
  }
  const momentum =
    (((quotes?.Bid ?? 0) - data.lastClosePrice) / data.lastClosePrice) * 100
  return (
    <XStack ai="center">
      {momentum !== 0 ? (
        <XStack rotate={momentum < 0 ? "180deg" : "0deg"}>
          <Icon
            name="trend"
            size={12}
            color={momentum > 0 ? colors.primary : colors.destructive}
          />
        </XStack>
      ) : null}
      <AnimatedFlow
        value={momentum || 0}
        fraction={0.01}
        addonsBefore={momentum > 0 ? "+" : ""}
        addonsAfter="%"
        color={momentum > 0 ? colors.primary : colors.destructive}
        bold
      />
    </XStack>
  )
}

const SellPriceCell: FC<{ data: Future; diff: number }> = ({ data, diff }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data?.futuresCode!],
    shallow
  )
  const sellPrice = (quotes?.Bid ?? data.sellPrice) - diff
  return (
    <AnimatedFlow
      color={
        quotes?.BidDiff > 0
          ? colors.primary
          : quotes?.BidDiff < 0
            ? colors.destructive
            : colors.secondary
      }
      bold
      value={quotes?.Bid ? sellPrice : Number(data.sellPrice)}
      fraction={data.volatility}
    />
  )
}

const BuyPriceCell: FC<{ data: Future; diff: number }> = ({ data, diff }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data?.futuresCode!],
    shallow
  )
  const buyPrice = (quotes?.Ask ?? data.buyPrice) + diff

  return (
    <AnimatedFlow
      value={quotes?.Ask ? buyPrice : Number(data.buyPrice)}
      fraction={data.volatility}
      bold
      color={
        quotes?.AskDiff > 0
          ? colors.primary
          : quotes?.AskDiff < 0
            ? colors.destructive
            : colors.secondary
      }
    />
  )
}

const ListItem: FC<{ data: Future }> = ({ data }) => {
  const currentSymbol = useSymbolStore((state) => state.currentSymbol, shallow)
  const diff = useMemo(
    () => ((data.volatility ?? 0) * (data.clazzSpread ?? 0)) / 2,
    [data.volatility, data.clazzSpread]
  )
  const available = data.isDeal
  return (
    <XStack
      gap="$sm"
      p="$md"
      bbc="$border"
      bc={currentSymbol?.symbol === data.futuresCode ? "$card" : "$background"}
      bbw={1}
      ai="center"
      onPress={() => {
        useSymbolStore.setState({
          currentSymbol:
            currentSymbol?.symbol === data.futuresCode
              ? undefined
              : { symbol: data.futuresCode!, volatility: data.volatility! },
        })
      }}
    >
      <YStack f={1} gap="$xs">
        <XStack gap="$sm" ai="center">
          <Text>{data.futuresShow}</Text>
          {data.selected ? <Icon name="starFilled" size={12} /> : null}
          {!data.isDeal ? <Icon name="moon" size={12} /> : null}
        </XStack>
        <Momentum data={data} />
      </YStack>
      <YStack
        p="$sm"
        ai="center"
        jc="center"
        w={102}
        h={44}
        boc="$border"
        br="$sm"
        bw={1}
        gap="$xs"
        onPress={() => {
          if (available) {
            const price =
              (useQuotesStore.getState().quotes[data.futuresCode!]?.Bid ??
                data.sellPrice) - diff
            useQuotesStore.setState({
              currentFuture: data,
              action: "sell",
              order: {
                position: 0.01,
                price,
              },
            })
            router.push("/order")
          }
        }}
      >
        <Text col={available ? "$text" : "$tertiary"}>{t("trade.sell")}</Text>
        <SellPriceCell data={data} diff={diff} />
      </YStack>
      <YStack
        p="$sm"
        ai="center"
        jc="center"
        w={102}
        h={40}
        boc="$border"
        br="$sm"
        gap="$xs"
        bw={1}
        onPress={() => {
          if (available) {
            const price =
              (useQuotesStore.getState().quotes[data.futuresCode!]?.Ask ??
                data.buyPrice) + diff
            useQuotesStore.setState({
              currentFuture: data,
              action: "buy",
              order: { position: 0.01, price: price },
            })
            router.push("/order")
          }
        }}
      >
        <Text col={available ? "$text" : "$tertiary"}>{t("trade.buy")}</Text>
        <BuyPriceCell data={data} diff={diff} />
      </YStack>
      <XStack
        hitSlop={16}
        onPress={() => {
          const price =
            (useQuotesStore.getState().quotes[data.futuresCode!]?.Bid ??
              data.sellPrice) - diff
          useQuotesStore.setState({
            activeIndex: 1,
            currentFuture: data,
            action: "buy",
            order: { position: 0.01, price },
          })
          router.push("/order")
        }}
      >
        <Icon name="chevronRight" size={16} />
      </XStack>
    </XStack>
  )
}

const keyExtractor = (
  item: Awaited<ReturnType<typeof getFutures>>["list"][number],
  index: number
) => `${item.futuresName!.toString()}${index}`

const renderItem = ({
  item,
}: {
  item: Awaited<ReturnType<typeof getFutures>>["list"][number]
}) => <ListItem data={item} />

export const FutureList = () => {
  const isFocused = useIsFocused()
  const { currentFuture, mutationFuture } = useSymbolStore(
    (state) => ({
      currentFuture: state.currentFuture,
      mutationFuture: state.mutationFuture,
    }),
    shallow
  )
  const { data, loading, loadingMore, loadMore, reload, mutate } =
    useInfiniteScroll<{
      list: Awaited<ReturnType<typeof getFutures>>["list"]
      nextId?: number
    }>(
      (d) => {
        if (!isFocused && Platform.OS === "web") {
          return Promise.resolve({
            list: d?.list ?? [],
            nextId: d?.nextId ?? 1,
          })
        }
        if (!currentFuture) {
          return Promise.resolve({
            list: d?.list ?? [],
            nextId: d?.nextId ?? 1,
          })
        }
        return getFutures({
          currentPage: d?.nextId ?? 1,
          pageSize: 10,
          codeOrName: "",
          type: currentFuture?.type || undefined,
          isBest: currentFuture?.isBest || undefined,
          isSelect: currentFuture?.isSelect || undefined,
        }).then((res) => {
          if (res.list?.length) {
            subscribeQuotes(
              res.list
                .map((it) => it.futuresCode)
                .concat(res.list.map((it) => it.linkFuturesCode))
            )
          }
          return res
        })
      },
      {
        isNoMore: (d) => d?.nextId === undefined,
        reloadDeps: [
          currentFuture?.name,
          currentFuture?.isSelect,
          currentFuture?.type,
          currentFuture?.isBest,
        ],
      }
    )

  const onToggle = useCallback(
    (params: { futuresId: number; selected: 0 | 1 }) => {
      mutate({
        ...data,
        list:
          data?.list?.map((it) =>
            it.futuresId === params.futuresId
              ? { ...it, selected: params.selected }
              : it
          ) ?? [],
      })
      useSymbolStore.setState({
        mutationFuture: undefined,
      })
      useForxlStore.setState({
        histories: useForxlStore.getState().histories?.map((item) => {
          if (item.futuresId === params.futuresId) {
            return {
              ...item,
              selected: params.selected,
            }
          }
          return item
        }),
      })
    },
    [data, mutate]
  )

  useEffect(() => {
    if (mutationFuture) {
      onToggle(mutationFuture)
    }
  }, [mutationFuture, onToggle])

  return (
    <YStack f={1} w={DEVICE_WIDTH}>
      <XStack p="$md" ai="center" jc="space-between">
        <FutureCategories />
        <XStack
          hitSlop={16}
          onPress={() => {
            router.push("/explore")
          }}
        >
          <Icon name="search" size={20}></Icon>
        </XStack>
      </XStack>
      {currentFuture ? (
        <FlatList
          data={data?.list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          refreshing={loading}
          refreshControl={
            <RefreshControl
              colors={[colors.tertiary]}
              progressBackgroundColor={colors.card}
              refreshing={loading}
              onRefresh={reload}
            />
          }
          ListEmptyComponent={() => (
            <ListEmptyComponent loading={loadingMore || loading} />
          )}
          onEndReached={loadMore}
          ListFooterComponent={() => (
            <ListFooterComponent loading={loadingMore} />
          )}
        ></FlatList>
      ) : null}
    </YStack>
  )
}
