import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"

import { ListItem, ScrollView, YStack } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"

const LINKS = [
  "product-disclosure-statement",
  "terms-and-conditions",
  "privacy-policy",
  "execution-policy",
  "complaint-handling-policy",
  "aml-cft",
]

export default function Layout() {
  const { t, i18n } = useTranslation()
  const dict = t("documents", {
    returnObjects: true,
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: t("profile.documents") }} />
      <ScrollView f={1} p="$md" showsVerticalScrollIndicator={false}>
        {dict.children.map((it, index) => (
          <ListItem
            title={it}
            key={index}
            onPress={() => {
              if (Platform.OS === "web") {
                window.open(
                  `https://www.forxlmarkets.com/#/help/documents/${LINKS[index]}?language=${i18n.language}`,
                  "_blank"
                )
                return
              }
              useWebViewStore.setState({
                uri: `https://www.forxlmarkets.com/#/help/documents/${LINKS[index]}?language=${i18n.language}`,
                title: it,
              })
              router.push("/web-view")
            }}
          />
        ))}
      </ScrollView>
    </YStack>
  )
}
