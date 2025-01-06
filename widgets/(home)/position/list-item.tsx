import _ from "lodash"
import { FC, ReactNode } from "react"

import { Text, XStack } from "~/components"

export const ListItem: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => {
  return (
    <XStack ai="center" jc="space-between" py="$sm">
      <Text col="$secondary">{label}</Text>
      {_.isString(children) ? <Text>{children}</Text> : children}
    </XStack>
  )
}
