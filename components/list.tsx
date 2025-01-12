import { FC, ReactNode } from "react"
import { TextProps, XStack } from "tamagui"

import { Icon, IconType } from "./icon"
import { Text } from "./text"

export const ListItem: FC<
  {
    title: string
    icon?: IconType
    onPress?: () => void
    disabled?: boolean
    addonAfter?: ReactNode
    isLink?: boolean
  } & TextProps
> = ({
  title,
  icon,
  addonAfter,
  onPress,
  disabled,
  isLink = true,
  ...rest
}) => {
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
      <Text f={1} title {...rest}>
        {title}
      </Text>
      {addonAfter}
      {isLink ? <Icon name="chevronRight" size={16}></Icon> : null}
    </XStack>
  )
}
