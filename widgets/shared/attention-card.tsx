import { FC, PropsWithChildren } from "react"

import { Card, Icon, Text } from "~/components"
import colors from "~/theme/colors"

export const AttentionCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card fd="row" gap="$sm" px={12} py="$sm">
      <Icon name="warn" size={20} color={colors.warning} />
      <Text col="$warning" f={1}>
        {children}
      </Text>
    </Card>
  )
}
