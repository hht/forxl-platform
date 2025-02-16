import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { FlatList, Platform } from "react-native"

import { getNews } from "~/api/dashboard"
import { Icon, Image, Text, XStack, YStack } from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useWebViewStore } from "~/hooks/useStore"
import { dayjs, trimHTML } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

const ListItem = ({
  item,
  index,
  dateVisible,
}: {
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
  index: number
  dateVisible?: boolean
}) => {
  const { t } = useTranslation()
  const html = trimHTML(item.content)
  return (
    <YStack px="$md" gap="$md" ov="hidden">
      {dateVisible ? (
        <YStack pt="$md" w="100%" btc="$border" btw={index === 0 ? 0 : 1}>
          <Text subject bold>
            {getDate(dayjs(item.date)).format("DD MMMM, YYYY")}
          </Text>
        </YStack>
      ) : null}
      <YStack btw={1} gap="$sm" btc="$border" py="$md">
        <Text numberOfLines={2} bold lh={20}>
          <Text col="$tertiary" bold lh={20}>
            {getDate(item.date).format("HH:mm  ")}
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
              bc={toRGBA(colors.primary, 0.1)}
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

const ListHeaderComponent = () => {
  return (
    <YStack gap="$md" p="$md">
      <Image
        source={require("~/assets/images/widgets/news.jpg")}
        w="100%"
        aspectRatio={311 / 68}
      />
    </YStack>
  )
}

const keyExtractor = (
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
) => item.id.toString()

export default function Page() {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const { data, loadMore, loadingMore } = useInfiniteScroll<{
    list: Awaited<ReturnType<typeof getNews>>["list"]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }
      return getNews({
        page: d?.nextId ?? 1,
        date: dayjs().format("YYYY-MM-DD"),
      })
    },
    {
      reloadDeps: [isFocused],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  return (
    <YStack f={1}>
      <Stack.Screen
        options={{
          title: t("tools.news"),
        }}
      />
      <FlatList
        data={data?.list}
        renderItem={({
          item,
          index,
        }: {
          item: Awaited<ReturnType<typeof getNews>>["list"][number]
          index: number
        }) => {
          return (
            <ListItem
              item={item}
              index={index}
              dateVisible={
                index === 0 ||
                dayjs(item.date).format("YYYY-MM-DD") !==
                  dayjs(data?.list?.[index - 1]?.date).format("YYYY-MM-DD")
              }
            />
          )
        }}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </YStack>
  )
}
