import { useIsFocused } from '@react-navigation/native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { router } from 'expo-router'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { getNewMessageCount } from '~/api/notifications'
import { Icon, IconType, Image, Text, XStack } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useWebViewStore } from '~/hooks/useStore'
import { TAWK_TO } from '~/lib/constants'
import colors from '~/theme/colors'

export const HeaderLeft: FC<{ onPress?: () => void }> = ({ onPress }) => {
  return (
    <XStack
      py={12}
      hitSlop={16}
      pl={Platform.OS === "web" ? 16 : 0}
      onPress={onPress ?? router.back}
    >
      <Icon name="arrowLeft" color={colors.text} size={20} />
    </XStack>
  )
}

export const BrandTitle: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack ai="center" jc="center" gap="$sm">
      <Image source={require("~/assets/images/widgets/logo.png")} width={24} height={24} />
      <Text title bold>
        {t("anon.title")}
      </Text>
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
  const { data: count, refresh } = useRequest(() => getNewMessageCount(type), {
    cacheKey: type === 0 ? CACHE_KEY.SYSTEM_MESSAGES : CACHE_KEY.TRADE_MESSAGES,
  })
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      refresh()
    }
  }, [isFocused, refresh])
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
          <Text col="$background" fos={10} bold>
            {count > 9 ? "9+" : count}
          </Text>
        </XStack>
      ) : null}
    </XStack>
  )
}

export const CustomerService: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack
      onPress={() => {
        useWebViewStore.setState({
          uri: TAWK_TO,
          title: t("anon.liveSupport"),
        })
        router.push("/web-view")
      }}
    >
      <Icon name="service" size={20} />
    </XStack>
  )
}

export const LiveSupport: FC = () => {
  const { t } = useTranslation()
  return (
    <XStack
      gap="$xs"
      hitSlop={10}
      ai="center"
      px={12}
      onPress={() => {
        useWebViewStore.setState({
          uri: TAWK_TO,
          title: t("anon.liveSupport"),
        })
        router.push("/web-view")
      }}
    >
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
