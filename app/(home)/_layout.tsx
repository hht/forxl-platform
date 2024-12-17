import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Stack } from 'expo-router/stack'
import 'react-native-reanimated'

import colors from '~/theme/colors'
import { HeaderLeft } from '~/widgets/navigation'

export const unstable_settings = {
  initialRouteName: "/(home)/tabs/",
}
const ScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: () => <HeaderLeft />,
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.text },
}

export default function Layout() {
  return <Stack screenOptions={ScreenOptions}></Stack>
}
