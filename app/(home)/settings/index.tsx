import { Stack } from "expo-router"
import { Fragment } from "react"
import { YStack } from "tamagui"

import { t } from "~/lib/utils"

export default function Layout() {
  return (
    <Fragment>
      <Stack.Screen options={{ title: t("settings.title") }}></Stack.Screen>
      <YStack f={1}></YStack>
    </Fragment>
  )
}
