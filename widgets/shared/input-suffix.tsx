import { FC } from 'react'
import { TextProps, XStack } from 'tamagui'

import { Text } from '~/components'

export const InputSuffix: FC<TextProps> = ({ children, disabled, onPress, ...rest }) => (
  <XStack
    pl="$md"
    h="100%"
    ai="center"
    jc="center"
    blc="$border"
    blw={1}
    disabled={disabled}
    onPress={onPress}
  >
    <Text {...rest}>{children}</Text>
  </XStack>
)
