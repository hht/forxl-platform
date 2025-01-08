import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll } from "ahooks"
import dayjs from "dayjs"
import { Stack } from "expo-router"
import { FlatList, Platform, RefreshControl } from "react-native"

import { getFundHistory } from "~/api/wallet"
import { Screen, YStack } from "~/components"
import { uuid } from "~/lib/utils"
import colors from "~/theme/colors"
import { AssetCard } from "~/widgets/(home)/tabs/wallet/asset-card"
import {
  ListEmptyComponent,
  ListHeaderComponent,
  ListItem,
} from "~/widgets/(home)/tabs/wallet/list"
import {
  TransactionDetails,
  useTransactionStore,
} from "~/widgets/(home)/tabs/wallet/transaction-details"
import {
  BrandTitle,
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"
import { ListFooterComponent } from "~/widgets/shared/list"
import { Gradient } from "~/widgets/shared/shape"

const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerTitle: () => <BrandTitle />,
  headerLeft: () => null,
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerRight: () => null,
}

const keyExtractor = (
  item: Awaited<ReturnType<typeof getFundHistory>>["list"][number]
) => item.id.toString()

export default function Page() {
  const isFocused = useIsFocused()
  const { data, loadMore, loading, loadingMore, reload } = useInfiniteScroll<{
    list: Awaited<ReturnType<typeof getFundHistory>>["list"]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }
      return getFundHistory({
        currentPage: d?.nextId ?? 1,
        pageSize: 10,
      })
    },
    {
      reloadDeps: [isFocused],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  return (
    <Screen pb={0} gap={0}>
      <Stack.Screen options={ScreenOptions} />
      <Gradient />
      <AssetCard />
      <YStack f={1}>
        <FlatList
          data={data?.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ListItem
              data={item}
              onPress={() => {
                useTransactionStore.setState({ data: item, reloadKey: uuid() })
              }}
              dateVisible={
                index === 0 ||
                dayjs(item.addTime).format("YYYY-MM-DD") !==
                  dayjs(data?.list?.[index - 1]?.addTime).format("YYYY-MM-DD")
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
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={<ListEmptyComponent loading={loading} />}
          ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
        ></FlatList>
      </YStack>
      <TransactionDetails />
    </Screen>
  )
}
