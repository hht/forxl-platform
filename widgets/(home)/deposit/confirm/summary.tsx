import { FC } from "react"
import { useTranslation } from "react-i18next"

import { Card, Copyable, Separator, Text, XStack, YStack } from "~/components"
import { useWalletStore } from "~/hooks/useStore"
import { dayjs, formatCurrency, formatDecimal } from "~/lib/utils"

const AmountCard: FC = () => {
  const { t } = useTranslation()
  const { depositResult } = useWalletStore()
  if (depositResult?.payType === 3) {
    return (
      <YStack gap="$sm">
        <Text>{t("wallet.yourDepositAmount")}</Text>
        <XStack ai="baseline">
          <Text subject>
            {formatDecimal(depositResult?.transferAmount ?? 0)}
            {depositResult?.currency}
          </Text>
          <Text col="$secondary">
            {` = ${formatCurrency(depositResult?.usdAmount)}`}
          </Text>
        </XStack>
        <Text caption col="$secondary">
          {dayjs().format("MMM DD, YYYY HH:mm:ss")}
        </Text>
      </YStack>
    )
  }
  return (
    <YStack gap="$sm">
      <Text>{t("wallet.yourDepositAmount")}</Text>
      <XStack ai="baseline" gap="$sm">
        <Text subject>{formatDecimal(depositResult?.price ?? 0)} USDT</Text>
        <Text col="$secondary">
          ={formatCurrency(depositResult?.price ?? 0)}
        </Text>
      </XStack>
    </YStack>
  )
}

export const DepositSummary: FC = () => {
  const { t } = useTranslation()
  const { depositMethod: method, depositResult } = useWalletStore()
  return (
    <Card>
      <AmountCard />
      <Separator />
      <YStack>
        <Card.Item title={t("trade.commission")}>
          {`${(method?.fee ?? 0) * 100}%`}
        </Card.Item>
        <Card.Item title={t("wallet.processingTime")}>
          {method?.arrivalTimeDesc}
        </Card.Item>
        {depositResult?.payType === 3 ? (
          <Card.Item title={t("wallet.order")}>
            <Copyable>{depositResult?.orderNo ?? "124"}</Copyable>
          </Card.Item>
        ) : (
          <Card.Item title={t("wallet.paymentAddress")}>
            <Copyable>{depositResult?.address ?? ""}</Copyable>
          </Card.Item>
        )}
      </YStack>
    </Card>
  )
}
