import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

import {
  Figure,
  ListItem,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useWebViewStore } from "~/hooks/useStore"

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
                case 3:
                  useWebViewStore.setState({
                    uri: "https://tawk.to/chat/6790da9c825083258e09206f/1ii6tbtqd",
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
