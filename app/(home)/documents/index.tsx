import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, XStack, YStack } from "tamagui"

import { Icon, Text } from "~/components"

const LINKS = [
  "http://www.163.com",
  "http://www.163.com",
  "http://www.163.com",
  "http://www.163.com",
  "http://www.163.com",
  "http://www.163.com",
]

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("documents", {
    returnObjects: true,
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: dict.title }} />
      <ScrollView f={1} py="$md">
        {dict.children.map((it) => (
          <XStack ai="center" jc="space-between" p="$md">
            <Text fos={15}>{it}</Text>
            <XStack hitSlop={16}>
              <Icon name="chevronRight" size={16} />
            </XStack>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  )
}
