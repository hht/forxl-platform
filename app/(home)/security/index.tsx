import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, YStack } from 'tamagui'

import { ListItem } from '~/components'

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
  const dict = t("security", {
    returnObjects: true,
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: dict.title }} />
      <ScrollView f={1} p="$md">
        {dict.children.map((it) => (
          <ListItem title={it} key={it} />
        ))}
      </ScrollView>
    </YStack>
  )
}
