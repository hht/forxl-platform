import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { DepositSummary } from './summary'

import { Card, Input, Text, YStack } from '~/components'
import { useWalletStore } from '~/hooks/useStore'
import { formatCurrency, trimHTML } from '~/lib/utils'
import { PaymentMethod } from '~/widgets/(home)/deposit/form/payment-method'
import { AttentionCard } from '~/widgets/shared/attention-card'
import { InfoCard } from '~/widgets/shared/info-card'
import { InputSuffix } from '~/widgets/shared/input-suffix'

export const DepositForm: FC = () => {
  const { t } = useTranslation()
  const { depositMethod: method, depositRequest } = useWalletStore()
  if (method?.payType === 3) {
    return (
      <Fragment>
        <AttentionCard>{t("wallet.depositBankPrompt")}</AttentionCard>
        {method?.remark1 ? (
          <InfoCard>{trimHTML(method.remark1)}</InfoCard>
        ) : null}
        {method?.remark2 ? (
          <InfoCard>{trimHTML(method.remark2)}</InfoCard>
        ) : null}
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
        <Card>
          <Text>
            {t("wallet.depositRangePrompt", {
              min: formatCurrency(method?.incomeMoneyMin ?? 0),
              max: formatCurrency(method?.incomeMoneyMax ?? 0),
              unit: "USD",
            })}
          </Text>
        </Card>
        <Input.Decimal
          label={t("wallet.depositAmount")}
          value={depositRequest.amount}
          min={method?.incomeMoneyMin}
          max={method?.incomeMoneyMax ?? 9999999}
          addonAfter={<InputSuffix>USD</InputSuffix>}
          disableValidation
          onChange={(amount) =>
            useWalletStore.setState({
              depositRequest: { ...depositRequest, amount },
            })
          }
        />
        <DepositSummary />
      </Fragment>
    )
  }
  if (method?.payType === 101) {
    return (
      <Fragment>
        <AttentionCard>{t("wallet.depositBankPrompt")}</AttentionCard>
        {method?.remark1 ? (
          <InfoCard>{trimHTML(method.remark1)}</InfoCard>
        ) : null}
        {method?.remark2 ? (
          <InfoCard>{trimHTML(method.remark2)}</InfoCard>
        ) : null}
        <PaymentMethod />
        <Card>
          <Text>
            {t("wallet.depositRangePrompt", {
              min: formatCurrency(method?.incomeMoneyMin ?? 0),
              max: formatCurrency(method?.incomeMoneyMax ?? 0),
              unit: "USD",
            })}
          </Text>
        </Card>
        <Input.Decimal
          label={t("wallet.depositAmount")}
          value={depositRequest.amount}
          min={method?.incomeMoneyMin}
          max={method?.incomeMoneyMax ?? 9999999}
          addonAfter={<InputSuffix>USD</InputSuffix>}
          disableValidation
          onChange={(amount) =>
            useWalletStore.setState({
              depositRequest: { ...depositRequest, amount },
            })
          }
        />
        <DepositSummary />
      </Fragment>
    )
  }
  return (
    <Fragment>
      <AttentionCard>{t("wallet.depositCryptoPrompt")}</AttentionCard>
      {method?.remark1 ? <InfoCard>{trimHTML(method.remark1)}</InfoCard> : null}
      {method?.remark2 ? <InfoCard>{trimHTML(method.remark2)}</InfoCard> : null}
      <PaymentMethod />
    </Fragment>
  )
}
