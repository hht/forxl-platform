import { FC } from "react"
import { useTranslation } from "react-i18next"

import { Card, Separator, Text, YStack } from "~/components"
import { useWalletStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import { PaymentMethodDescription } from "~/widgets/shared/payment-methods"

export const DepositSummary: FC = () => {
  const { depositMethod: method, depositRequest } = useWalletStore()
  const { t } = useTranslation()
  if (!method) return null
  return (
    <Card gap={12}>
      <YStack gap="$sm">
        <Text col="$secondary">{t("wallet.youWillGet")}</Text>
        <Text
          subject
        >{`$${formatDecimal(depositRequest?.amount ? depositRequest.amount - (method.fee ?? 0) : 0)}`}</Text>
      </YStack>
      <Separator />
      <PaymentMethodDescription method={method} />
    </Card>
  )
}
