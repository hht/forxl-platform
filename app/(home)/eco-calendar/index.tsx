import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { YStack } from "tamagui"

import { Text } from "~/components"
import { Calendar } from "~/widgets/(home)/eco-calendar/calendar"

export default function Page() {
  const { t } = useTranslation()

  return (
    <YStack f={1} bc="$background">
      <Stack.Screen options={{ title: t("tools.calendar") }}></Stack.Screen>
      <YStack p="$md">
        <Text fos={12}>{t("tools.calendarDesc")}</Text>
      </YStack>
      <Calendar />
    </YStack>
  )
}
