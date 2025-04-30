import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, Separator, Text, YStack } from '~/components'
import { useWalletStore } from '~/hooks/useStore'
import { formatCurrency } from '~/lib/utils'
import { WithdrawMethodDescription } from '~/widgets/shared/payment-methods'

export const WithdrawSummary: FC = () => {
  const { withdrawMethod: method, withdrawRequest } = useWalletStore()
  const { t } = useTranslation()
  if (!method) return null
  return (
    <Card gap={12}>
      <YStack gap="$sm">
        <Text col="$secondary">{t("wallet.youWillGet")}</Text>
        <Text subject>
          {formatCurrency(
            withdrawRequest?.money
              ? method.feeType === 1
                ? parseFloat(withdrawRequest.money ?? '0') * (1 - (method.feeValue ?? 0) / 100)
                : parseFloat(withdrawRequest.money ?? '0') - (method.feeValue ?? 0)
              : 0
          )}
        </Text>
      </YStack>
      <Separator />
      <WithdrawMethodDescription method={method} />
    </Card>
  )
}
