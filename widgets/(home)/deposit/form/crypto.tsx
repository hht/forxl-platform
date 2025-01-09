import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Text, YStack } from "~/components"
import { usePaymentStore } from "~/hooks/useStore"
import { trimHTML } from "~/lib/utils"
import { AttentionCard } from "~/widgets/shared/attention-card"
import { InfoCard } from "~/widgets/shared/info-card"
import { PaymentMethod } from "~/widgets/shared/payment-method"

export const Crypto: FC = () => {
  const { t } = useTranslation()
  const { method } = usePaymentStore()
  return (
    <Fragment>
      <AttentionCard>{t("wallet.depositCryptoPrompt")}</AttentionCard>
      <InfoCard>
        {t("wallet.minimumDepositPrompt", { min: `${method?.incomeMoneyMin}` })}
      </InfoCard>
      {method?.remark ? <InfoCard>{trimHTML(method.remark)}</InfoCard> : null}
      <PaymentMethod />
      <YStack gap="$sm">
        <Text head>{t("wallet.addressPrompt")}</Text>
        <Text col="$secondary">{t("wallet.addressPromptDesc")}</Text>
      </YStack>
    </Fragment>
  )
}
