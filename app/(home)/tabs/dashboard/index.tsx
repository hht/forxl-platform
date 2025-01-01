import { useIsFocused } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { useInfiniteScroll } from "ahooks"
import dayjs from "dayjs"
import { Stack } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Platform } from "react-native"
import { XStack } from "tamagui"

import { getNews } from "~/api/dashboard"
import { Screen, Text } from "~/components"
import colors from "~/theme/colors"
import { AssetCard } from "~/widgets/(home)/tabs/dashboard/asset-card"
import {
  ListHeaderComponent,
  ListItem,
} from "~/widgets/(home)/tabs/dashboard/list"
import {
  BrandTitle,
  BreadCrumb,
  CustomerService,
  DefaultScreenOptions,
  NativeStackNavigationOptions,
  Notifier,
} from "~/widgets/shared/header"
import { Gradient } from "~/widgets/shared/shape"

const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerTitle: () => <BrandTitle />,
  headerLeft: () => <BreadCrumb />,
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerRight: () => (
    <XStack gap={24} px="$md">
      <Notifier />
      <CustomerService />
    </XStack>
  ),
}

const renderItem = ({
  item,
  index,
}: {
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
  index: number
}) => {
  return <ListItem item={item} index={index} />
}

export default function Page() {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const { data, loading, loadMore, loadingMore } = useInfiniteScroll<{
    list: Awaited<ReturnType<typeof getNews>>["list"]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }
      return getNews({
        page: d?.nextId ?? 1,
        date: dayjs().subtract(3, "d").format("YYYY-MM-DD"),
      })
    },
    {
      reloadDeps: [isFocused],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  const ListFooterComponent = useCallback(() => {
    if (!data?.list.length) return null
    return (
      <XStack
        gap="$md"
        px="$md"
        bblr="$md"
        bbrr="$md"
        bbw={1}
        bbc="$border"
        blw={1}
        brw={1}
        brc="$border"
        blc="$border"
        bc="$card"
        mb="$md"
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
    <Screen pb={0} gap={0}>
      <Stack.Screen options={ScreenOptions} />
      <Gradient />
      <AssetCard />
      <FlashList
        data={data?.list}
        renderItem={renderItem}
        estimatedItemSize={168}
        keyExtractor={(item) => `${item.id}`}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      ></FlashList>
    </Screen>
  )
}
