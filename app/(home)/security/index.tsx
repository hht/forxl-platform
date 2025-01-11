import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

import { ListItem, ScrollView, YStack } from "~/components"

const ROUTE = [
  "/security/reset-password",
  "/security/2fa",
  "/security/de-activation",
] as const

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("security", {
    returnObjects: true,
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: dict.title }} />
      <ScrollView f={1} p="$md" showsVerticalScrollIndicator={false}>
        {dict.children.map((it, index) => (
          <ListItem
            title={it}
            key={it}
            onPress={() => {
              router.push(ROUTE[index])
            }}
          />
        ))}
      </ScrollView>
    </YStack>
  )
}
