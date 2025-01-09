import { router } from "expo-router"
import { FC } from "react"

import { Card, Icon, Image, Text } from "~/components"
import { useWalletStore } from "~/hooks/useStore"

export const PaymentMethod: FC = () => {
  const { method } = useWalletStore()
  if (!method) return null
  return (
    <Card
      fd="row"
      ai="center"
      p="$md"
      onPress={() => {
        router.back()
      }}
    >
      <Image source={{ uri: method.picUrl }} w={40} h={40}></Image>
      <Text f={1} fos={15} lh={20}>
        {method.name}
      </Text>
      <Icon name="chevronRight" size={16}></Icon>
    </Card>
  )
}
