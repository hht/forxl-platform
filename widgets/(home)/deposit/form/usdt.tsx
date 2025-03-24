import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Text, YStack } from '~/components'
import { useWalletStore } from '~/hooks/useStore'
import { PaymentMethod } from '~/widgets/(home)/deposit/form/payment-method'
import { InfoCard } from '~/widgets/shared/info-card'

export const USDT: FC = () => {
  const { t } = useTranslation()
  const { depositMethod: method } = useWalletStore()
  return (
    <Fragment>
      <InfoCard>
        {t("wallet.minimumDepositPrompt", { min: `${method?.incomeMoneyMin}` })}
      </InfoCard>
      {method?.remark ? <InfoCard>{method.remark}</InfoCard> : null}
      <PaymentMethod />
      <YStack gap="$sm">
        <Text heading>{t("wallet.addressPrompt", {
          name: method?.name
        })}</Text>
        <Text col="$secondary">{t("wallet.addressPromptDesc", {
          name: method?.name
        })}</Text>
      </YStack>
    </Fragment>
  )
}
