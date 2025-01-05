import dayjs from "dayjs"
import { router } from "expo-router"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Banners } from "./banners"
import { Shortcuts } from "./short-cuts"

import { getNews } from "~/api/dashboard"
import { Figure, Icon, Image, Text, XStack, YStack } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"
import colors, { toRGBA } from "~/theme/colors"

export const ListItem = ({
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
      ov="hidden"
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

export const ListHeaderComponent = () => (
  <YStack gap="$md">
    <Banners />
    <Shortcuts />
  </YStack>
)
