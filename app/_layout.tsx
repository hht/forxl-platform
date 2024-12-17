import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { enableFreeze, enableScreens } from 'react-native-screens'
import { TamaguiProvider } from 'tamagui'

import { Toaster } from '~/components'
import config from '~/theme/tamagui.config'
import { initI18Next } from '~/utils'

enableScreens(true)
enableFreeze(true)

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(home)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

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
    <GestureHandlerRootView>
      <TamaguiProvider config={config}>
        <ThemeProvider value={DarkTheme}>
          <Stack
            initialRouteName="(home)"
            screenOptions={{ headerShown: false }}
          ></Stack>
        </ThemeProvider>
        <StatusBar style="light" translucent />
        <Toaster />
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}
