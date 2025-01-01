import { Stack } from "expo-router/stack"
import "react-native-reanimated"

import { useWallet } from "~/hooks/useWallet"
import colors from "~/theme/colors"
import {
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"

export const unstable_settings = {
  initialRouteName: "/(home)/tabs",
}
const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
}

export default function Layout() {
  useWallet()
  return <Stack screenOptions={ScreenOptions} />
}
