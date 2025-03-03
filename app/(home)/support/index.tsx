import { router, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { Figure, ListItem, ScrollView, Text, XStack, YStack } from '~/components'
import { useForxlStore, useWebViewStore } from '~/hooks/useStore'
import { TAWK_TO } from '~/lib/constants'

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("support", {
    returnObjects: true,
  })
  return (
    <ScrollView f={1} p="$md" showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("profile.support") }} />
      <XStack ai="center" jc="center" p="$md">
        <Figure name="supportBanner" />
      </XStack>
      <YStack p="$md" gap="$md" ai="center" jc="center">
        <Text subject bold>
          {dict.header}
        </Text>
        <Text col="$secondary" ta="center">
          {dict.desc}
        </Text>
      </YStack>
      <YStack>
        {dict.children.map((item, index) => (
          <ListItem
            key={index}
            title={item}
            onPress={() => {
              switch (index) {
                case 2:
                  const uri = `https://www.forxlmarkets.com/help/faq?language=${useForxlStore.getState().language}`
                  if (Platform.OS === "web") {
                    window.open(uri, "_blank")
                    return
                  }
                  useWebViewStore.setState({
                    uri,
                    title: item,
                  })
                  router.push("/web-view")
                  return
                case 3:
                  useWebViewStore.setState({
                    uri: TAWK_TO,
                    title: t("anon.liveSupport"),
                  })
                  router.push("/web-view")
                  return
                default:
              }
            }}
          />
        ))}
      </YStack>
    </ScrollView>
  )
}
