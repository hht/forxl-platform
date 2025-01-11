import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll } from "ahooks"
import { router } from "expo-router"
import { FC, useCallback, useEffect, useMemo } from "react"
import { FlatList, Platform, RefreshControl } from "react-native"
import { shallow } from "zustand/shallow"

import { FutureCategories } from "./categories"

import { getFutures } from "~/api/trade"
import { AnimatedFlow, Icon, Text, XStack, YStack } from "~/components"
import { useQuotesStore, useSymbolStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import { DEVICE_WIDTH, t } from "~/lib/utils"
import colors from "~/theme/colors"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

const INITIAL = {
  Ask: 0,
  Bid: 0,
  High: 0,
  Low: 0,
  AskDiff: 0,
  BidDiff: 0,
  LastUpdate: Date.now(),
}

const Momentum: FC<{
  data?: Future
  quotes: Pick<Quotes, "Bid"> & { BidDiff: number }
}> = ({ data, quotes }) => {
  if (!data || !data.isDeal || !data.lastClosePrice || !quotes?.Bid) {
    return (
      <XStack>
        <Text col="$secondary" bold>
          $0.00%
        </Text>
      </XStack>
    )
  }
  const momentum =
    ((quotes.Bid - data.lastClosePrice) / data.lastClosePrice) * 100
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
        value={momentum}
        fraction={0.01}
        addonsBefore={momentum > 0 ? "+" : ""}
        addonsAfter="%"
        bold
        col={
          momentum > 0
            ? "$primary"
            : momentum < 0
              ? "$destructive"
              : "$secondary"
        }
      />
    </XStack>
  )
}

const ListItem: FC<{ data: Future }> = ({ data }) => {
  const quotes = useQuotesStore(
    (state) => state.quotes[data.futuresCode!] ?? INITIAL,
    shallow
  )

  const diff = useMemo(
    () => ((data.volatility ?? 0) * (data.clazzSpread ?? 0)) / 2,
    [data.volatility, data.clazzSpread]
  )
  const buyPrice = (quotes?.Ask ?? data.buyPrice) + diff
  const sellPrice = (quotes?.Bid ?? data.sellPrice) - diff
  const available = data.isDeal
  return (
    <XStack gap="$sm" p="$md" bbc="$border" bbw={1} ai="center">
      <YStack f={1} gap="$sm">
        <XStack gap="$sm" ai="center">
          <Text>{data.futuresShow}</Text>
          {data.selected ? <Icon name="starFilled" size={12} /> : null}
          {!data.isDeal ? <Icon name="moon" size={12} /> : null}
        </XStack>
        <Momentum data={data} quotes={quotes} />
      </YStack>
      <YStack
        p="$sm"
        ai="center"
        jc="center"
        w={88}
        h={44}
        boc="$border"
        br="$sm"
        bw={1}
        onPress={() => {
          if (available) {
            useQuotesStore.setState({
              currentFuture: data,
              action: "sell",
              order: {
                position: 0.01,
                price: sellPrice,
              },
            })
            router.push("/order")
          }
        }}
      >
        <Text col={available ? "$text" : "$tertiary"}>{t("trade.sell")}</Text>
        <AnimatedFlow
          col={
            quotes?.BidDiff > 0
              ? "$primary"
              : quotes?.BidDiff < 0
                ? "$destructive"
                : "$secondary"
          }
          bold
          value={quotes.Bid ? sellPrice : Number(data.sellPrice)}
          fraction={data.volatility}
        />
      </YStack>
      <YStack
        p="$sm"
        ai="center"
        jc="center"
        w={88}
        h={40}
        boc="$border"
        br="$sm"
        bw={1}
        onPress={() => {
          if (available) {
            useQuotesStore.setState({
              currentFuture: data,
              action: "buy",
              order: { position: 0.01, price: buyPrice },
            })
            router.push("/order")
          }
        }}
      >
        <Text col={available ? "$text" : "$tertiary"}>{t("trade.buy")}</Text>
        <AnimatedFlow
          value={quotes.Ask ? buyPrice : Number(data.buyPrice)}
          fraction={data.volatility}
          bold
          col={
            quotes?.AskDiff > 0
              ? "$primary"
              : quotes?.AskDiff < 0
                ? "$destructive"
                : "$secondary"
          }
        />
      </YStack>
      <XStack
        onPress={() => {
          useQuotesStore.setState({
            currentFuture: data,
            action: "buy",
            order: { position: 0.01, price: sellPrice },
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
        reloadDeps: [currentFuture?.name],
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
        <XStack hitSlop={16} onPress={() => {}}>
          <Icon name="search" size={20}></Icon>
        </XStack>
      </XStack>
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
    </YStack>
  )
}
