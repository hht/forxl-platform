import { Stack } from "expo-router/stack"
import "react-native-reanimated"

import colors from "~/theme/colors"
import {
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/header"

export const unstable_settings = {
  initialRouteName: "/(home)/tabs",
}
const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
}

export default function Layout() {
  return <Stack screenOptions={ScreenOptions} />
}
