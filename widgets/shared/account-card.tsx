import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getAssets } from '~/api/wallet'
import { Card, Icon, Text, YStack } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { formatDecimal } from '~/lib/utils'

export const AccountCard: FC = () => {
  const { t } = useTranslation()
  const { data } = useRequest(getAssets, {
    cacheKey: CACHE_KEY.ASSETS,
  })
  return (
    <Card ai="center" fd="row" gap={12}>
      <Icon name="dollar" size={48} />
      <YStack gap="$sm">
        <Text fos={17} fow="bold">
          {`$${formatDecimal(data?.userWalletDetail.fundsAccount.available ?? 0)}`}
        </Text>
        <Text col="$secondary">{`${t("wallet.account")} ${data?.userWalletDetail.fundsAccount.userId}`}</Text>
      </YStack>
    </Card>
  )
}
