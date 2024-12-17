import { Link, useRouter } from "expo-router"
import { YStack } from "tamagui"

import { Button } from "~/components"

export default function Page() {
  const router = useRouter()
  return (
    <YStack f={1} bc="$background" ai="center" jc="center" gap={16}>
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
          router.replace("/(home)/tabs/dashboard")
        }}
      >
        进入系统
      </Button>
    </YStack>
  )
}
