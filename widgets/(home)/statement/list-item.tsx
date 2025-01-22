import _ from "lodash"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { YStack } from "tamagui"

import { getWalletStatement } from "~/api/wallet"
import { Card, Icon, Justified, Text, XStack } from "~/components"
import { getDate } from "~/hooks/useLocale"
import { formatCurrency } from "~/lib/utils"

export const StatementItem: FC<{
  data: Awaited<ReturnType<typeof getWalletStatement>>["list"][number]
}> = ({ data }) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  return (
    <Card gap="$sm" mb="$md">
      <Justified>
        <Text title>{data.title}</Text>
        <Text title col={data.amount < 0 ? "$destructive" : "$primary"}>
          {formatCurrency(data.amount)}
        </Text>
      </Justified>
      <Justified>
        <Text caption col="$secondary">
          {getDate(data.time).format("MMM DD, YYYY HH:mm")}
        </Text>
        <XStack
          rotate={visible ? "270deg" : "90deg"}
          hitSlop={16}
          onPress={() => {
            setVisible((prev) => !prev)
          }}
        >
          <Icon name="chevronRight" size={14} />
        </XStack>
      </Justified>
      {visible && (
        <YStack gap="$sm" btc="$border" btw={1} pt="$sm">
          <Justified>
            <Text col="$secondary">{t("wallet.type")}</Text>
            <Text>{t(`wallet.${_.lowerFirst(data.typeName)}` as any)}</Text>
          </Justified>
          <Justified>
            <Text col="$secondary">{t("order.id")}</Text>
            <Text>{data.id}</Text>
          </Justified>
        </YStack>
      )}
    </Card>
  )
}
