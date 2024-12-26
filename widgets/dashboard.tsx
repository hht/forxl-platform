import BottomSheetBase from "@gorhom/bottom-sheet"
import { useInterval } from "ahooks"
import { Href, router } from "expo-router"
import _ from "lodash"
import { FC, Fragment, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { XStack, YStack } from "tamagui"

import { getBanners } from "~/api/dashboard"
import { getAssets } from "~/api/wallet"
import {
  BottomSheet,
  Card,
  Icon,
  IconType,
  Image,
  ScrollView,
  Text,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"

export const AssetCard: FC = () => {
  const { data } = useRequest(getAssets)
  const { t } = useTranslation()
  return (
    <Card fd="row" ai="center">
      <YStack gap="$sm" f={1}>
        <Text>{t("home.wallet")}</Text>
        <XStack ai="baseline" gap="$xs">
          <Text col="$primary" fos={28} lh={28} mr="$xs" fow="900">
            {formatDecimal(data?.userWalletDetail.fundsAccount.available ?? 0)}
          </Text>
          <Text>USD</Text>
        </XStack>
      </YStack>
      <Icon name="chevronRight" />
    </Card>
  )
}

const CAROUSEL_WIDTH = Dimensions.get("window").width - 32

export const Banners = () => {
  const { data } = useRequest(getBanners)
  const ref = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const banners = useMemo(() => {
    if (!data?.length) return []
    return [data[data.length - 1], ...data]
  }, [data])
  useInterval(() => {
    if (!data?.length) return
    const next = (currentIndex + 1) % banners.length
    if (next === 0) {
      setCurrentIndex(1)
      ref.current?.scrollTo({
        x: 0,
        animated: false,
      })
      ref.current?.scrollTo({
        x: CAROUSEL_WIDTH,
        animated: true,
      })
    } else {
      setCurrentIndex(next)
      ref.current?.scrollTo({
        x: next * CAROUSEL_WIDTH,
        animated: true,
      })
    }
  }, 3000)
  return (
    <XStack w="100%" br="$sm" ov="hidden" mt="$md">
      <ScrollView
        ref={ref}
        scrollEnabled={false}
        horizontal
        w="100%"
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: CAROUSEL_WIDTH, y: 0 }}
      >
        {banners?.map((banner, index) => (
          <Image
            key={index}
            aspectRatio={343 / 160}
            w={CAROUSEL_WIDTH}
            source={{ uri: banner.img }}
          />
        ))}
      </ScrollView>
      <XStack pos="absolute" w="100%" jc="center" bottom={0} gap="$sm" p="$sm">
        {_.times(data?.length ?? 0).map((index) => (
          <Icon
            name="dot"
            width={13}
            key={index}
            height={3}
            color={currentIndex === index + 1 ? colors.text : colors.secondary}
          ></Icon>
        ))}
      </XStack>
    </XStack>
  )
}

const SHORTCUT_ROUTES: { [key: number]: { icon: IconType; href?: Href } } = {
  0: {
    icon: "addFunds",
    href: "/tabs/wallet",
  },
  1: {
    icon: "withdraw",
    href: "/tabs/wallet",
  },
  2: {
    icon: "kyc",
    href: "/tabs/wallet",
  },
  3: {
    icon: "card",
    href: "/tabs/wallet",
  },
  4: {
    icon: "referral",
    href: "/tabs/wallet",
  },
  5: {
    icon: "statement",
    href: "/tabs/wallet",
  },
  6: {
    icon: "support",
    href: "/tabs/wallet",
  },
  7: {
    icon: "community",
    href: "/tabs/wallet",
  },
  8: {
    icon: "security",
    href: "/tabs/wallet",
  },
  9: {
    icon: "website",
    href: "/tabs/wallet",
  },
  10: {
    icon: "calendar",
    href: "/tabs/wallet",
  },
  11: {
    icon: "news",
    href: "/tabs/wallet",
  },
  12: {
    icon: "more",
  },
} as const

const SHORTCUT_SIZE = (Dimensions.get("window").width - 16 * 5) / 4

export const Shortcuts: FC = () => {
  const { t } = useTranslation()
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const insets = useSafeAreaInsets()
  const shortcuts = t("home.shortcuts", { returnObjects: true })
  const items = useMemo(
    () => [
      ..._.times(7).map((index) => ({
        title: shortcuts.children[index],
        index,
      })),
      { title: shortcuts.children[12], index: 12 },
    ],
    [shortcuts]
  )
  return (
    <Fragment>
      <XStack gap="$md" w="100%" fw="wrap">
        {items.map((item) => (
          <Card
            p={0}
            w={SHORTCUT_SIZE}
            h={SHORTCUT_SIZE}
            key={item.index}
            onPress={() => {
              if (SHORTCUT_ROUTES[item.index].href) {
                router.push(SHORTCUT_ROUTES[item.index].href!)
              } else {
                bottomSheetRef.current?.expand()
              }
            }}
            ai="center"
            jc="center"
          >
            <Icon
              name={SHORTCUT_ROUTES[item.index].icon}
              color={colors.primary}
              size={32}
            />
            <Text col="$secondary" caption>
              {item.title}
            </Text>
          </Card>
        ))}
      </XStack>
      <BottomSheet
        ref={bottomSheetRef}
        title={shortcuts.title}
        onClose={() => bottomSheetRef.current?.close()}
      >
        <XStack gap="$md" w="100%" fw="wrap" px="$md" pb={insets.bottom + 16}>
          {_.times(12).map((item, index) => (
            <Card
              p={0}
              key={index}
              w={SHORTCUT_SIZE}
              h={SHORTCUT_SIZE}
              onPress={() => {
                if (SHORTCUT_ROUTES[index].href) {
                  router.push(SHORTCUT_ROUTES[index].href!)
                } else {
                  bottomSheetRef.current?.expand()
                }
              }}
              ai="center"
              jc="center"
            >
              <Icon
                name={SHORTCUT_ROUTES[index].icon}
                size={32}
                color={colors.primary}
              />
              <Text col="$secondary" caption>
                {shortcuts.children[index]}
              </Text>
            </Card>
          ))}
        </XStack>
      </BottomSheet>
    </Fragment>
  )
}
