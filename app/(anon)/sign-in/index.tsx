import { Stack, useRouter } from 'expo-router'
import { YStack } from 'tamagui'

import { Button } from '~/components'
import { NativeStackNavigationOptions } from '~/widgets/header'

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
}

export default function Page() {
  const router = useRouter()
  return (
    <YStack f={1} bc="$background" ai="center" jc="center" gap={16}>
      <Stack.Screen options={ScreenOptions} />
      <Button
        onPress={() => {
          router.replace("/(anon)/sign-up")
        }}
      >
        注册
      </Button>
      <Button
        onPress={() => {
          router.back()
        }}
      >
        返回
      </Button>
    </YStack>
  )
}
