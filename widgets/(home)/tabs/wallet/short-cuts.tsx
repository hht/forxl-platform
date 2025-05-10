import { Href, router } from 'expo-router'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { Card, Icon, IconType, Text, YStack } from '~/components'
import colors from '~/theme/colors'

const SHORTCUT_ROUTES: { [key: number]: { icon: IconType; href?: Href } } = {
  0: {
    icon: "addFunds",
    href: "/deposit",
  },
  1: {
    icon: "withdraw",
    href: "/withdraw",
  },
  2: {
    icon: "statement",
    href: "/statement",
  },
  3: {
    icon: "card",
    href: "/tabs/wallet",
  },
} as const

export const Shortcuts: FC = () => {
  const { t } = useTranslation()
  const items = useMemo(
    () =>
      [
        t("wallet.addFunds"),
        t("wallet.withdraw"),
        t("wallet.statement"),
        t("wallet.card"),
      ].map((t, index) => ({ title: t, index })),
    [t]
  )
  return (
    <Card gap={13} w="100%" fd="row" px={0}>
      {items.filter(it => !(Platform.OS === 'android' && it.index === 3)).map((item) => (
        <YStack
          f={1}
          key={item.index}
          onPress={() => {
            if (SHORTCUT_ROUTES[item.index].href) {
              router.push(SHORTCUT_ROUTES[item.index].href!)
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
        </YStack>
      ))}
    </Card>
  )
}
