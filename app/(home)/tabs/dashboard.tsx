import { useIsFocused } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { useInfiniteScroll } from "ahooks"
import dayjs from "dayjs"
import { router, Stack } from "expo-router"
import { Fragment, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Platform } from "react-native"
import { XStack, YStack } from "tamagui"

import { getNews } from "~/api/dashboard"
import { Figure, Icon, Image, Screen, Text } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"
import colors, { toRGBA } from "~/theme/colors"
import { AssetCard, Banners, Shortcuts } from "~/widgets/dashboard"
import {
  BrandTitle,
  BreadCrumb,
  CustomerService,
  DefaultScreenOptions,
  NativeStackNavigationOptions,
  Notifier,
} from "~/widgets/header"
import { Gradient } from "~/widgets/tabs"

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

const ListItem = ({
  item,
  index,
}: {
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
  index: number
}) => {
  const { t } = useTranslation()
  const html = item.content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // 移除 style 标签及内容
    .replace(/<[^>]+>/g, "") // 移除其他 HTML 标签
    .replace(/&nbsp;/g, " ") // 替换 HTML 空格
    .replace(/\s+/g, " ") // 合并多个空格
    .trim()
  const isFirst = index === 0
  return (
    <YStack
      px="$md"
      bc="$card"
      blw={1}
      brw={1}
      btw={isFirst ? 1 : 0}
      blc="$border"
      brc="$border"
      gap="$md"
      btc={isFirst ? "$border" : "transparent"}
      btlr={isFirst ? "$sm" : 0}
      btrr={isFirst ? "$sm" : 0}
      mt={index === 0 ? "$md" : 0}
    >
      {index === 0 ? (
        <Fragment>
          <YStack gap="$md" pt="$md">
            <XStack ai="center" gap="$xs">
              <Icon name="hot" />
              <Text fow="900" fos={17} lh={20}>
                {t("home.news")}
              </Text>
            </XStack>
            <Image
              source={require("~/assets/images/widgets/news.jpg")}
              w="100%"
              aspectRatio={311 / 68}
            />
            <Text fow="700">{dayjs(item.date).format("DD MMMM, YYYY")}</Text>
          </YStack>
          <XStack pos="absolute" top={0} right={0} w="100%">
            <Figure name="r" />
          </XStack>
        </Fragment>
      ) : null}
      <YStack btw={1} gap="$sm" btc="$border" py="$md">
        <Text numberOfLines={2} fow="900" lh={20}>
          <Text col="$tertiary" fow="900" lh={20}>
            {dayjs(item.date).format("HH:mm  ")}
          </Text>
          {item.headline}
        </Text>
        <Text numberOfLines={3} col="$secondary" lh={20}>
          {html}
        </Text>
        {item.content ? (
          <XStack jc="flex-end">
            <XStack
              ai="center"
              jc="center"
              gap="$xs"
              bg={toRGBA(colors.primary, 0.1)}
              px="$sm"
              py="$sm"
              br="$xs"
              onPress={() => {
                useWebViewStore.setState({
                  html: item.content,
                  title: item.headline,
                })
                router.push("/web-view")
              }}
            >
              <Text col="$primary">{t("home.readMore")}</Text>
              <Icon
                name="chevronRight"
                width={16}
                height={16}
                color={colors.primary}
              />
            </XStack>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  )
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

const ListHeaderComponent = () => (
  <YStack gap="$md">
    <Banners />
    <Shortcuts />
  </YStack>
)

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
