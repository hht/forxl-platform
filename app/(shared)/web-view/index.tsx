import { useUnmount } from "ahooks"
import { Stack } from "expo-router"
import { ActivityIndicator, Platform } from "react-native"
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
        <meta name="color-scheme" content="dark">
        <meta name="theme-color" content="#000000">
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
        uri ? (
          <iframe src={uri} style={{ flex: 1, border: 0 }}></iframe>
        ) : (
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: wrappedHtml ?? "" }}
          ></div>
        )
      ) : (
        <WebView
          forceDarkOn
          containerStyle={{ backgroundColor: "#000" }}
          style={{ backgroundColor: "#000" }}
          source={uri ? { uri } : { html: wrappedHtml ?? "" }}
          startInLoadingState={true}
          renderLoading={() => (
            <YStack
              f={1}
              pos="absolute"
              l={0}
              r={0}
              t={0}
              b={0}
              ai="center"
              jc="center"
              bc="$background"
            >
              <ActivityIndicator />
            </YStack>
          )}
        />
      )}
    </YStack>
  )
}
