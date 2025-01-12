import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { DarkTheme, ThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router/stack"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { Fragment } from "react"
import { Platform, UIManager } from "react-native"
import { AvoidSoftInput } from "react-native-avoid-softinput"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import "react-native-reanimated"
import { enableFreeze, enableScreens } from "react-native-screens"
import { TamaguiProvider } from "tamagui"

import { Toaster } from "~/components"
import { PortalProvider } from "~/components/portal"
import { useReady } from "~/hooks/useReady"
import config from "~/theme/tamagui.config"
import { AccountDetector, LocaleDetector } from "~/widgets/shared/detector"
import { PromptSheet } from "~/widgets/shared/prompt-sheet"

enableScreens(true)
enableFreeze(true)

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(anon)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

AvoidSoftInput.setEnabled(true)
// AvoidSoftInput.setEasing("easeIn")
// AvoidSoftInput.setAvoidOffset(Platform.OS === "ios" ? 16 : 32)
// AvoidSoftInput.setHideAnimationDelay(100)
// AvoidSoftInput.setHideAnimationDuration(300)
// AvoidSoftInput.setShowAnimationDelay(100)
// AvoidSoftInput.setShowAnimationDuration(200)
// AvoidSoftInput.setAdjustResize()

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

export default function RootLayout() {
  const ready = useReady()
  if (!ready) return null
  return (
    <Fragment>
      <AccountDetector />
      <LocaleDetector />
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <PortalProvider>
            <TamaguiProvider config={config}>
              <ThemeProvider value={DarkTheme}>
                <Stack
                  initialRouteName="(anon)"
                  screenOptions={{ headerShown: false }}
                />
              </ThemeProvider>
              <StatusBar style="light" translucent />
              <Toaster />
              <PromptSheet />
            </TamaguiProvider>
          </PortalProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Fragment>
  )
}
