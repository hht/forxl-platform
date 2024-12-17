import { Stack, useRouter } from 'expo-router'
import { YStack } from 'tamagui'

import { Button } from '~/components'

export default function Page() {
  const router = useRouter()
  return (
    <YStack f={1} bc="$background" ai="center" jc="center" gap={16}>
      <Stack.Screen options={{ title: "" }} />
      <Button
        onPress={() => {
          router.replace("/(anon)/sign-in")
        }}
      >
        登录
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
