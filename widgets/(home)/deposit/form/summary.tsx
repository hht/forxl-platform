import { FC } from "react"
import { useTranslation } from "react-i18next"

import { Card, Separator, Text, YStack } from "~/components"
import { usePaymentStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import { PaymentMethodDescription } from "~/widgets/shared/payment-methods"

export const DepositSummary: FC = () => {
  const { method, data } = usePaymentStore()
  const { t } = useTranslation()
  if (!method) return null
  return (
    <Card gap={12}>
      <YStack gap="$sm">
        <Text col="$secondary">{t("wallet.youWillGet")}</Text>
        <Text
          subject
        >{`$${formatDecimal(data.amount ? data.amount - (method.fee ?? 0) : 0)}`}</Text>
      </YStack>
      <Separator />
      <PaymentMethodDescription method={method} />
    </Card>
  )
}
