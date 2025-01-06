import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useMount } from 'ahooks'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { Platform, UIManager } from 'react-native'
import { AvoidSoftInput } from 'react-native-avoid-softinput'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { enableFreeze, enableScreens } from 'react-native-screens'
import { TamaguiProvider } from 'tamagui'

import { Toaster } from '~/components'
import { initI18Next } from '~/lib/utils'
import config from '~/theme/tamagui.config'
import { AccountDetector } from '~/widgets/shared/detector'
import { PromptSheet } from '~/widgets/shared/prompt-sheet'

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

const I18Next: FC<{ children: ReactNode }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  useMount(() => {
    initI18Next().then(() => {
      setLoaded(true)
    })
  })
  if (!loaded) {
    return null
  }
  return children
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  })
  useEffect(() => {
    if (loaded) {
      initI18Next()
      SplashScreen.hideAsync()
    }
  }, [loaded])
  return (
    <Fragment>
      <I18Next>
        <AccountDetector />
        <GestureHandlerRootView>
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
        </GestureHandlerRootView>
      </I18Next>
    </Fragment>
  )
}
