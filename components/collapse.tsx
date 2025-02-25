import _ from "lodash"
import { FC, ReactNode } from "react"
import { XStack, XStackProps } from "tamagui"

import { Switch } from "./switch"
import { Text } from "./text"
import { Card } from "./view"

export const Collapse: FC<
  {
    title: ReactNode
    children: ReactNode
    expended?: boolean
    disabled?: boolean
    toggleExpended: (v: boolean) => void
  } & XStackProps
> = ({ title, children, expended, toggleExpended, disabled, ...rest }) => {
  return (
    <Card gap="$md" p="$md" {...rest}>
      <XStack ai="center" jc="space-between">
        {_.isString(title) ? <Text bold>{title}</Text> : title}
        <Switch
          checked={expended ?? false}
          disabled={disabled}
          onCheckedChange={toggleExpended}
        />
      </XStack>
      {expended && children}
    </Card>
  )
}
