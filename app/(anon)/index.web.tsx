import { router } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { useTranslation } from 'react-i18next'

import Logo from '~/assets/images/widgets/logo.png'
import { Button, Image, Screen, Text, YStack } from '~/components'
import {
  DefaultScreenOptions, LiveSupport, NativeStackNavigationOptions
} from '~/widgets/shared/header'

const ScreenOption: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerLeft: undefined,
  title: "",
  headerRight: () => <LiveSupport />,
}

export default function Page() {
  const { t } = useTranslation()
  return (
    <Screen>
      <Stack.Screen options={ScreenOption} />
      <YStack f={1} gap="$md" p="$xs" ai="center" pt="20%">
        <Image source={Logo} width={90} height={90} />
        <Text fos={24} lh={24} bold>
          {t("anon.title")}
        </Text>
        <Text col="$secondary" ta="center">
          {t("anon.desc")}
        </Text>
      </YStack>
      <YStack gap="$md" pb="$md">
        <Button
          onPress={() => {
            router.push("/auth/sign-in")
          }}
        >
          {t("anon.login")}
        </Button>
        <Button
          type="accent"
          onPress={() => {
            router.push("/auth/sign-up")
          }}
        >
          {t("anon.signUp")}
        </Button>
      </YStack>
    </Screen>
  )
}
