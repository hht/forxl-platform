import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Stack } from 'expo-router/stack'
import { Fragment } from 'react'
import 'react-native-reanimated'

export const unstable_settings = {
  initialRouteName: "(anon)",
}

const ScreenOptions: NativeStackNavigationOptions = {
  animationTypeForReplace: "pop",
}

export default function Layout() {
  return (
    <Fragment>
      <Stack.Screen options={ScreenOptions}></Stack.Screen>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </Fragment>
  )
}
