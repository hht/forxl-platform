import { useRouter } from 'expo-router'
import { FC } from 'react'
import { Platform } from 'react-native'

import { Icon, XStack } from '~/components'

const px = Platform.OS === "web" ? 12 : 0

export const HeaderLeft: FC<{ onPress?: () => void }> = ({ onPress }) => {
  const router = useRouter()
  return (
    <XStack px={px} py={12} hitSlop={10} onPress={onPress ?? router.back}>
      <Icon name="arrowLeft" size={20} />
    </XStack>
  )
}
