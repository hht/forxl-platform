import { Stack } from "expo-router"
import { WebView } from "react-native-webview"

import { YStack } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"
import { DefaultScreenOptions } from "~/widgets/header"

export default function Page() {
  const { uri, title } = useWebViewStore()
  return (
    <YStack bc="$background" f={1}>
      <Stack.Screen
        options={{
          ...DefaultScreenOptions,
          title: title ?? "",
        }}
      />
      <WebView source={{ uri: uri ?? "" }} />
    </YStack>
  )
}
