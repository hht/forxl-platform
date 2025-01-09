import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Input, YStack } from "~/components"
import { usePaymentStore } from "~/hooks/useStore"
import { trimHTML } from "~/lib/utils"
import { AttentionCard } from "~/widgets/shared/attention-card"
import { InfoCard } from "~/widgets/shared/info-card"
import { PaymentMethod } from "~/widgets/shared/payment-method"

export const Fiat: FC = () => {
  const { t } = useTranslation()
  const { method, data } = usePaymentStore()
  return (
    <Fragment>
      <AttentionCard>{t("wallet.depositBankPrompt")}</AttentionCard>
      {method?.remark ? <InfoCard>{trimHTML(method.remark)}</InfoCard> : null}
      <PaymentMethod />
      <YStack gap="$sm">
        <Input
          label={t("wallet.bankName")}
          value={data.payBank}
          onChangeText={(payBank) =>
            usePaymentStore.setState({ data: { ...data, payBank } })
          }
        />
        <Input
          label={t("wallet.accountHolderName")}
          value={data.payName}
          onChangeText={(payName) =>
            usePaymentStore.setState({ data: { ...data, payName } })
          }
        />
        <Input
          label={t("wallet.bankAccount")}
          value={data.payAccount}
          onChangeText={(payAccount) =>
            usePaymentStore.setState({ data: { ...data, payAccount } })
          }
        />
      </YStack>
    </Fragment>
  )
}
