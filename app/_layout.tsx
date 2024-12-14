import { Slot, Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import "react-native-reanimated"
import { enableFreeze, enableScreens } from "react-native-screens"
import { TamaguiProvider, YStack } from "tamagui"

import config from "~/theme/tamagui.config"

enableScreens(true)
enableFreeze(true)

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(home)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Stack>
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  )
}
