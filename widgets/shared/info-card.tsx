import _ from "lodash"
import { FC, PropsWithChildren } from "react"

import { Card, Icon, Text } from "~/components"

export const InfoCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card fd="row" gap="$sm" px={12} py="$sm">
      <Icon name="info" size={20} />
      {_.isString(children) ? (
        <Text col="$secondary" f={1} lh={20}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Card>
  )
}
