import { Stack } from "expo-router/stack"
import { Fragment } from "react"
import "react-native-reanimated"

import { useWallet } from "~/hooks/useWallet"
import colors from "~/theme/colors"
import {
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"

export const unstable_settings = {
  initialRouteName: "tabs",
}
const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
}

const SocketRunner = () => {
  useWallet()
  return null
}

export default function Layout() {
  return (
    <Fragment>
      <Stack screenOptions={ScreenOptions} />
      <SocketRunner />
    </Fragment>
  )
}
