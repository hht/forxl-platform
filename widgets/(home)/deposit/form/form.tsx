import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Input, Text, YStack } from "~/components"
import { useWalletStore } from "~/hooks/useStore"
import { trimHTML } from "~/lib/utils"
import { PaymentMethod } from "~/widgets/(home)/deposit/form/payment-method"
import { AttentionCard } from "~/widgets/shared/attention-card"
import { InfoCard } from "~/widgets/shared/info-card"

export const DepositForm: FC = () => {
  const { t } = useTranslation()
  const { depositMethod: method, depositRequest } = useWalletStore()
  if (method?.payType === 3) {
    return (
      <Fragment>
        <AttentionCard>{t("wallet.depositBankPrompt")}</AttentionCard>
        {method?.remark ? <InfoCard>{trimHTML(method.remark)}</InfoCard> : null}
        <PaymentMethod />
        <YStack gap="$sm">
          <Input
            label={t("wallet.bankName")}
            value={depositRequest.payBank}
            onChangeText={(payBank) =>
              useWalletStore.setState({
                depositRequest: { ...depositRequest, payBank },
              })
            }
          />
          <Input
            label={t("wallet.accountHolderName")}
            value={depositRequest.payName}
            onChangeText={(payName) =>
              useWalletStore.setState({
                depositRequest: { ...depositRequest, payName },
              })
            }
          />
          <Input
            label={t("wallet.bankAccount")}
            value={depositRequest.payAccount}
            onChangeText={(payAccount) =>
              useWalletStore.setState({
                depositRequest: { ...depositRequest, payAccount },
              })
            }
          />
        </YStack>
      </Fragment>
    )
  }
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
