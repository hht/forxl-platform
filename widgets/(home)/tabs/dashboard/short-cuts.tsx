import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Href, router } from "expo-router"
import _ from "lodash"
import { FC, Fragment, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  BottomSheet,
  Button,
  Card,
  Dialog,
  Figure,
  Icon,
  IconType,
  Popup,
  Text,
  XStack,
  YStack,
} from "~/components"
import { waitFor } from "~/lib/utils"
import colors from "~/theme/colors"

const SHORTCUT_SIZE = (Dimensions.get("window").width - 16 * 5) / 4

export const Shortcuts: FC = () => {
  const { t } = useTranslation()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const insets = useSafeAreaInsets()
  const shortcuts = t("home.shortcuts", { returnObjects: true })
  const [visible, toggleVisible] = useState(false)
  const SHORTCUT_ROUTES: {
    [key: number]: { icon: IconType; href?: Href; onPress?: () => void }
  } = useMemo(
    () =>
      ({
        0: {
          icon: "addFunds",
          href: "/deposit",
        },
        1: {
          icon: "withdraw",
          href: "/withdraw",
        },
        2: {
          icon: "kyc",
          onPress: () => {
            toggleVisible(true)
          },
        },
        3: {
          icon: "card",
          href: "/tabs/wallet",
        },
        4: {
          icon: "referral",
          href: "/referral-program",
        },
        5: {
          icon: "statement",
          href: "/tabs/wallet",
        },
        6: {
          icon: "support",
          href: "/support",
        },
        7: {
          icon: "community",
          href: "/tabs/wallet",
        },
        8: {
          icon: "security",
          href: "/security",
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
      }) as const,
    [toggleVisible]
  )
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
            onPress={async () => {
              if (SHORTCUT_ROUTES[item.index].href) {
                router.push(SHORTCUT_ROUTES[item.index].href!)
                return
              }
              if (SHORTCUT_ROUTES[item.index].onPress) {
                console.log("onPress")
                SHORTCUT_ROUTES[item.index].onPress?.()
                return
              }
              bottomSheetRef.current?.present()
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
        onDismiss={() => bottomSheetRef.current?.dismiss()}
      >
        <XStack gap="$md" w="100%" fw="wrap" px="$md" pb={insets.bottom + 16}>
          {_.times(12).map((item, index) => (
            <Card
              p={0}
              key={index}
              w={SHORTCUT_SIZE}
              h={SHORTCUT_SIZE}
              onPress={async () => {
                bottomSheetRef.current?.dismiss()
                if (SHORTCUT_ROUTES[index].href) {
                  await waitFor(200)
                  router.push(SHORTCUT_ROUTES[index].href!)
                  return
                }
                if (SHORTCUT_ROUTES[index].onPress) {
                  SHORTCUT_ROUTES[index].onPress()
                  return
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
      <Popup visible={visible} onClose={() => toggleVisible(false)}>
        <Dialog br="$md">
          <YStack ai="center" px="$md" gap={12}>
            <Figure name="suspension" width={148} color={colors.background} />
            <Text subject>{t("wallet.tips")}</Text>
            <Text col="$secondary" ta="center">
              {t("wallet.depositConfirmPrompt")}
            </Text>
          </YStack>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                toggleVisible(false)
              }}
            >
              {t("home.later")}
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={async () => {
                toggleVisible(false)
                await waitFor(200)
                router.push("/security")
              }}
            >
              {t("home.enable2FA")}
            </Button>
          </XStack>
        </Dialog>
      </Popup>
    </Fragment>
  )
}
