import * as Linking from "expo-linking"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"

import { Button, Figure, Screen, Text, toast, YStack } from "~/components"
import { t } from "~/lib/utils"
import {
  BrandTitle,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"

const ScreenOptions: NativeStackNavigationOptions = {
  headerTitle: () => <BrandTitle />,
  headerLeft: () => null,
}

const openInbox = async (email: string) => {
  try {
    if (!email) return
    Linking.openURL(`http://${email.split("@")[1]}`)
  } catch (error) {
    toast.show(t("message.openEmailError"))
  }
}

export default function Page() {
  const { t } = useTranslation()
  const { email } = useLocalSearchParams()
  return (
    <Screen gap={32}>
      <Stack.Screen options={ScreenOptions} />
      <YStack gap="$md" f={1} ai="center" jc="center" p="$lg">
        <Figure name="verifyEmail" />
        <Text subject bold>
          {t("anon.verifyYourEmail")}
        </Text>
        <Text col="$secondary" ta="center">
          {t("anon.verifyYourEmailDesc")}
        </Text>
      </YStack>
      <YStack gap="$md" ai="center" pb={32}>
        <Button w="100%" onPress={() => openInbox(email as string)}>
          {t("action.openEmailApp")}
        </Button>
        <Button w="100%" type="accent" onPress={router.back}>
          {t("anon.noThanks")}
        </Button>
      </YStack>
    </Screen>
  )
}
