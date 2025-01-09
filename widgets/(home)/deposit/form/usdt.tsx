import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Text, YStack } from "~/components"
import { useWalletStore } from "~/hooks/useStore"
import { InfoCard } from "~/widgets/shared/info-card"
import { PaymentMethod } from "~/widgets/shared/payment-method"

export const USDT: FC = () => {
  const { t } = useTranslation()
  const { method } = useWalletStore()
  return (
    <Fragment>
      <InfoCard>
        {t("wallet.minimumDepositPrompt", { min: `${method?.incomeMoneyMin}` })}
      </InfoCard>
      {method?.remark ? <InfoCard>{method.remark}</InfoCard> : null}
      <PaymentMethod />
      <YStack gap="$sm">
        <Text head>{t("wallet.addressPrompt")}</Text>
        <Text col="$secondary">{t("wallet.addressPromptDesc")}</Text>
      </YStack>
    </Fragment>
  )
}
