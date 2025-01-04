import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Figure, ListItem, ScrollView, Text, XStack, YStack } from '~/components'

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
          <ListItem key={index} title={item} />
        ))}
      </YStack>
    </ScrollView>
  )
}
