import { Link, useRouter } from "expo-router"
import { Stack } from "expo-router/stack"
import { YStack } from "tamagui"

import { Button } from "~/components"

export default function Page() {
  const router = useRouter()
  return (
    <YStack f={1} ai="center" jc="center" gap={16}>
      <Stack.Screen options={{ headerShown: false }} />
      <Link href="/(anon)/sign-up" asChild>
        <Button>注册</Button>
      </Link>
      <Button
        onPress={() => {
          router.push("/(anon)/sign-up")
        }}
      >
        登录
      </Button>
      <Button
        onPress={() => {
          router.replace("/tabs/dashboard")
        }}
      >
        进入系统
      </Button>
    </YStack>
  )
}
