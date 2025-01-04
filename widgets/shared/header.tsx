import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { router } from 'expo-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getNewMessageCount } from '~/api/notifications'
import { Figure, Icon, IconType, Text, XStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import colors from '~/theme/colors'

export const HeaderLeft: FC<{ onPress?: () => void }> = ({ onPress }) => {
  return (
    <XStack py={12} hitSlop={16} onPress={onPress ?? router.back}>
      <Icon name="arrowLeft" color={colors.text} size={20} />
    </XStack>
  )
}

export const BrandTitle: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack ai="center" jc="center" gap="$sm">
      <Figure name="logo" width={24} height={24} />
      <Text head>{t("anon.title")}</Text>
    </XStack>
  )
}

export const BreadCrumb: FC = () => {
  return (
    <XStack
      px={12}
      py={12}
      hitSlop={10}
      onPress={() => {
        router.push("/(home)/profile")
      }}
    >
      <Icon name="menu" size={20} />
    </XStack>
  )
}

export const Notifier: FC<{ icon?: IconType; type?: number }> = ({
  icon = "email",
  type = 0,
}) => {
  const { data: count } = useRequest(() => getNewMessageCount(type))
  return (
    <XStack onPress={() => router.push(`/(home)/notifications/${type}`)}>
      <Icon name={icon} size={20} />
      {count ? (
        <XStack
          pos="absolute"
          top={-12}
          right={-16}
          ai="center"
          jc="center"
          bc="$primary"
          br={999}
          py={2}
          px={6}
        >
          <Text col="$background" fos={10} fow="900">
            {count > 9 ? "9+" : count}
          </Text>
        </XStack>
      ) : null}
    </XStack>
  )
}

export const CustomerService: FC = () => {
  return (
    <XStack onPress={() => router.push("/(home)/customer-service")}>
      <Icon name="service" size={20} />
    </XStack>
  )
}

export const LiveSupport: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack gap="$xs" hitSlop={10} ai="center" px={12}>
      <Icon name="bubble" size={18} />
      <Text>{t("anon.liveSupport")}</Text>
    </XStack>
  )
}

export const DefaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: () => <HeaderLeft />,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTitleAlign: "center",
}

export { NativeStackNavigationOptions }
