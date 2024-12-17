import { Stack } from "expo-router/stack"
import { Fragment } from "react"

import colors from "~/theme/colors"
import {
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/header"

export const unstable_settings = {
  initialRouteName: "(anon)",
}

const ScreenOptions: NativeStackNavigationOptions = {
  animationTypeForReplace: "pop",
  headerShown: false,
}

const StackOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerStyle: {
    backgroundColor: colors.background,
  },
}

export default function Layout() {
  return (
    <Fragment>
      <Stack.Screen options={ScreenOptions}></Stack.Screen>
      <Stack screenOptions={StackOptions}></Stack>
    </Fragment>
  )
}
