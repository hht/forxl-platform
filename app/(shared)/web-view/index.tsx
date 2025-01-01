import { useUnmount } from "ahooks"
import { Stack } from "expo-router"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

import { YStack } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"
import { DefaultScreenOptions } from "~/widgets/shared/header"

export default function Page() {
  const { uri, title, html } = useWebViewStore()
  useUnmount(() => {
    useWebViewStore.setState({ uri: "", title: "", html: "" })
  })
  const darkModeCSS = `
    body {
      background-color: #000 !important;
      color: #fff !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
      padding: 16px !important;
    }
    * {
      color: #fff !important;
      border-color: #333 !important;
    }
    a, button {
      color: #58a6ff !important;
    }
    img, video {
      opacity: 0.8;
      width: 100%;
    }
  `

  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>${darkModeCSS}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `

  return (
    <YStack bc="$background" f={1}>
      <Stack.Screen
        options={{
          ...DefaultScreenOptions,
          title: title ?? "",
        }}
      />
      {Platform.OS === "web" ? (
        <div
          style={{
            flex: 1,
            padding: 16,
            overflowY: "auto",
          }}
          dangerouslySetInnerHTML={{ __html: wrappedHtml ?? "" }}
        ></div>
      ) : (
        <WebView
          forceDarkOn
          style={{ backgroundColor: "#000" }}
          source={uri ? { uri } : { html: wrappedHtml ?? "" }}
        />
      )}
    </YStack>
  )
}
