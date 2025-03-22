import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, Icon, Text, YStack } from '~/components'
import { useForxlStore, useStatisticsStore } from '~/hooks/useStore'
import { formatCurrency } from '~/lib/utils'

export const AccountCard: FC = () => {
  const { t } = useTranslation()
  const { available } = useStatisticsStore()
  const userId = useForxlStore(state => state.account?.id)
  return (
    <Card ai="center" fd="row" gap={12}>
      <Icon name="dollar" size={48} />
      <YStack gap="$sm">
        <Text heading bold>
          {formatCurrency(available)}
        </Text>
        <Text col="$secondary">{`${t("wallet.account")} ${userId ?? ''}`}</Text>
      </YStack>
    </Card>
  )
}
