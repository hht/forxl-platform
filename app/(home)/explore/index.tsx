import { useDebounce, useInfiniteScroll, useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import _, { update } from "lodash"
import { FC, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import {
  getExploreHistories,
  getFutures,
  toggleFavorite,
  updateExploreHistories,
} from "~/api/trade"
import { Icon, Row, Text, XStack, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useFroxlStore, useQuotesStore, useSymbolStore } from "~/hooks/useStore"
import { subscribeQuotes } from "~/hooks/useWebsocket"
import colors from "~/theme/colors"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

const onPress = (data: Future) => {
  if (!useQuotesStore.getState().quotes[data.futuresCode!]) {
    subscribeQuotes([data.futuresCode!])
  }
  if (
    !useFroxlStore
      .getState()
      .histories?.find((it) => it.futuresId === data.futuresId)
  ) {
    updateExploreHistories(
      _.takeRight(
        [
          ...(useFroxlStore
            .getState()
            .histories?.filter((item) => item.futuresId !== data.futuresId) ??
            []),
          data,
        ],
        10
      ).map((it) => `${it.futuresId}`)
    )
  }

  useQuotesStore.setState({
    currentFuture: data,
    action: "buy",
    order: { position: 0.01, price: parseFloat(data.sellPrice ?? "0") },
  })
  router.push("/order")
}

const ListItem: FC<{
  data: Future
  onSuccess: (data: Future) => void
}> = ({ data, onSuccess }) => {
  const { loading, runAsync } = useRequest(toggleFavorite, {
    manual: true,
  })
  return (
    <XStack
      h={68}
      ai="center"
      onPress={() => {
        onPress(data)
      }}
    >
      <YStack f={1} gap="$sm">
        <Row gap="$sm">
          <Text>{data.futuresShow}</Text>
          {data.isDeal ? null : <Icon name="moon" size={16} />}
        </Row>
        <Text caption col="$secondary">
          {data.futuresName}
        </Text>
      </YStack>
      <XStack
        hitSlop={16}
        disabled={loading}
        onPress={() => {
          const previous = data.selected
          runAsync({
            futuresId: data.futuresId!,
            selected: previous ?? 0,
          }).then(() => {
            onSuccess({
              ...data,
              selected: previous ? 0 : 1,
            })
          })
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Icon name={data.selected ? "starFilled" : "star"} size={16} />
        )}
      </XStack>
    </XStack>
  )
}

const keyExtractor = (item: { futuresId?: number }) => `${item.futuresId!}`

export default function Page() {
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()
  const [isFocused, setIsFocused] = useState(false)
  const { codeOrName } = useSymbolStore((state) => state, shallow)

  const debouncedCodeOrName = useDebounce(codeOrName, {
    wait: 500,
    trailing: true,
  })
  const { data, loadingMore, mutate, loading } = useInfiniteScroll<{
    list: Future[]
    nextId?: number
  }>(
    (d) => {
      if (!codeOrName) {
        return Promise.resolve({
          list: useFroxlStore.getState().histories ?? [],
          nextId: undefined,
        })
      }
      return getFutures({
        currentPage: d?.nextId ?? 1,
        pageSize: 10,
        codeOrName: debouncedCodeOrName,
      })
    },
    {
      isNoMore: (d) => d?.nextId === undefined,
      reloadDeps: [debouncedCodeOrName],
    }
  )
  const onToggle = useCallback(
    (params: { futuresId?: number; selected?: 0 | 1 }) => {
      if (data) {
        mutate({
          ...data,
          list: data?.list?.map((it) =>
            it.futuresId === params.futuresId
              ? { ...it, selected: params.selected }
              : it
          ),
        })
      }
      getExploreHistories()
    },
    [mutate, data]
  )
  useRequest(getExploreHistories, {
    cacheKey: CACHE_KEY.HISTORIES,
  })
  useUnmount(() => {
    useSymbolStore.setState({ codeOrName: "" })
  })
  return (
    <YStack px="$md" pt={top + 16} f={1}>
      <Stack.Screen options={{ headerShown: false }} />
      <XStack ai="center" gap="$md" w="100%">
        <XStack
          gap="$sm"
          boc={isFocused ? colors.primary : colors.border}
          bw={1}
          br="$sm"
          ai="center"
          h={40}
          mih={40}
          px="$md"
          f={1}
        >
          <XStack>
            {loading || loadingMore ? (
              <ActivityIndicator size="small" />
            ) : (
              <Icon name="search" size={20} />
            )}
          </XStack>
          <TextInput
            placeholderTextColor="transparent"
            underlineColorAndroid={undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t("trade.searchSymbol")}
            autoFocus
            keyboardAppearance="dark"
            value={codeOrName}
            style={[
              styles.container,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(codeOrName) =>
              useSymbolStore.setState({ codeOrName: codeOrName ?? "" })
            }
          />
        </XStack>
        <XStack hitSlop={16} onPress={router.back}>
          <Text bold>{t("action.cancel")}</Text>
        </XStack>
      </XStack>
      <FlatList
        data={data?.list ?? []}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <ListItem data={item} onSuccess={onToggle} />}
        contentContainerStyle={{
          paddingVertical: 16,
        }}
        ListHeaderComponent={
          !codeOrName ? (
            <YStack py="$md">
              <Text col="$secondary">{t("trade.lastSeen")}</Text>
            </YStack>
          ) : null
        }
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
      ></FlatList>
    </YStack>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? "100%" : undefined,
    height: "100%",
    flex: Platform.OS === "web" ? undefined : 1,
    backgroundColor: "transparent",
    fontSize: 15,
    borderWidth: 0,
    borderColor: "transparent",
  },
})
