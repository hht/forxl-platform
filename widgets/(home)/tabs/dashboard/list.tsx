import dayjs from "dayjs"
import { router } from "expo-router"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Banners } from "./banners"
import { Shortcuts } from "./short-cuts"

import { getNews } from "~/api/dashboard"
import { Figure, Icon, Image, Text, XStack, YStack } from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useWebViewStore } from "~/hooks/useStore"
import { trimHTML } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

export const ListItem = ({
  item,
  index,
}: {
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
  index: number
}) => {
  const { t } = useTranslation()
  const html = trimHTML(item.content)
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
              <Text bold heading>
                {t("home.news")}
              </Text>
            </XStack>
            <Image
              source={require("~/assets/images/widgets/news.jpg")}
              w="100%"
              aspectRatio={311 / 68}
            />
            <Text bold>{getDate(item.date).format("DD MMMM, YYYY")}</Text>
          </YStack>
          <XStack pos="absolute" top={0} right={0} w="100%">
            <Figure name="r" />
          </XStack>
        </Fragment>
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

export const ListHeaderComponent = () => (
  <YStack gap="$md">
    <Banners position={0} />
    <Shortcuts />
  </YStack>
)

export const ListEmptyComponent = () => {
  const { t } = useTranslation()
  return (
    <YStack
      px="$md"
      bc="$card"
      bw={1}
      boc="$border"
      gap="$md"
      ov="hidden"
      br="$sm"
      my="$md"
    >
      <Fragment>
        <YStack gap="$md" pt="$md">
          <XStack ai="center" gap="$xs">
            <Icon name="hot" />
            <Text bold heading>
              {t("home.news")}
            </Text>
          </XStack>
          <Image
            source={require("~/assets/images/widgets/news.jpg")}
            w="100%"
            aspectRatio={311 / 68}
          />
        </YStack>
        <XStack pos="absolute" top={0} right={0} w="100%">
          <Figure name="r" />
        </XStack>
      </Fragment>
      <YStack gap="$sm" p="$lg" ai="center" jc="center">
        <Text bold col="$secondary" lh={20}>
          {t("message.empty")}
        </Text>
      </YStack>
    </YStack>
  )
}
