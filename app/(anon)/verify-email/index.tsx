import * as Linking from "expo-linking"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

import { Button, Figure, Screen, Text, toast, YStack } from "~/components"
import { t } from "~/lib/utils"
import { BrandTitle, NativeStackNavigationOptions } from "~/widgets/header"

const ScreenOptions: NativeStackNavigationOptions = {
  header: () => <BrandTitle />,
}

const openInbox = async () => {
  try {
    const schemes = [
      "message://",
      "inbox://",
      "gmail://",
      "email://",
      "mailto:",
    ]
    for (const scheme of schemes) {
      const canOpen = await Linking.canOpenURL(scheme)
      if (canOpen) {
        await Linking.openURL(scheme)
        break
      }
    }
  } catch (error) {
    toast.show(t("anon.openEmailError"))
  }
}

export default function Page() {
  const { t } = useTranslation()

  return (
    <Screen gap={32}>
      <Stack.Screen options={ScreenOptions} />
      <YStack gap="$md" f={1} ai="center" jc="center" p="$lg">
        <Figure name="verifyEmail" />
        <Text subject>{t("anon.verifyYourEmail")}</Text>
        <Text col="$secondary" ta="center">
          {t("anon.verifyYourEmailDesc")}
        </Text>
      </YStack>
      <YStack gap="$md" ai="center" pb={32}>
        <Button w="100%" onPress={openInbox}>
          {t("anon.openEmail")}
        </Button>
        <Button w="100%" type="accent" onPress={router.back}>
          {t("anon.noThanks")}
        </Button>
      </YStack>
    </Screen>
  )
}
