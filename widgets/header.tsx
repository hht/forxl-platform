import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { router } from "expo-router"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Figure, Icon, Text, XStack } from "~/components"
import colors from "~/theme/colors"

const px = Platform.OS === "web" ? 12 : 0

export const HeaderLeft: FC<{ onPress?: () => void }> = ({ onPress }) => {
  return (
    <XStack px={px} py={12} hitSlop={10} onPress={onPress ?? router.back}>
      <Icon name="arrowLeft" size={20} />
    </XStack>
  )
}

export const BrandTitle: FC = () => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()
  return (
    <XStack p="$md" pt={top + 16} ai="center" jc="center" gap="$sm">
      <Figure name="logo" width={24} height={24} />
      <Text head>{t("anon.title")}</Text>
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
      px={Platform.OS === "web" ? "$md" : 0}
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
