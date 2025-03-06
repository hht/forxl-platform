import { router, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { ListItem, ScrollView, YStack } from '~/components'
import { useWebViewStore } from '~/hooks/useStore'
import { APP_URL } from '~/lib/constants'

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
              const uri = `${APP_URL}/help/documents/${LINKS[index]}?language=${i18n.language}`
              if (Platform.OS === "web") {
                window.open(uri, "_blank")
                return
              }
              useWebViewStore.setState({
                uri,
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
