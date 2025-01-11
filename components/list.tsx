import { FC, ReactNode } from "react"
import { XStack } from "tamagui"

import { Icon, IconType } from "./icon"
import { Text } from "./text"

export const ListItem: FC<{
  title: string
  icon?: IconType
  onPress?: () => void
  disabled?: boolean
  addonAfter?: ReactNode
  isLink?: boolean
}> = ({ title, icon, addonAfter, onPress, disabled, isLink = true }) => {
  return (
    <XStack
      gap="$sm"
      h={56}
      ai="center"
      disabled={disabled}
      o={disabled ? 0.5 : 1}
      onPress={onPress}
    >
      {icon ? <Icon name={icon} size={24} /> : null}
      <Text f={1} title>
        {title}
      </Text>
      {addonAfter}
      {isLink ? <Icon name="chevronRight" size={16}></Icon> : null}
    </XStack>
  )
}
