import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, XStack, YStack } from "tamagui"

import { Figure, Icon, Text } from "~/components"

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("support", {
    returnObjects: true,
  })
  return (
    <ScrollView f={1} p="$md">
      <Stack.Screen options={{ title: dict.title }} />
      <XStack ai="center" jc="center" p="$md">
        <Figure name="supportBanner" />
      </XStack>
      <YStack p="$md" gap="$md" ai="center" jc="center">
        <Text subject>{dict.header}</Text>
        <Text col="$secondary" ta="center">
          {dict.desc}
        </Text>
      </YStack>
      <YStack>
        {dict.children.map((item, index) => (
          <XStack py="$md" ai="center" jc="space-between" key={index}>
            <Text>{item}</Text>
            <Icon name="chevronRight" size={16} />
          </XStack>
        ))}
      </YStack>
    </ScrollView>
  )
}
