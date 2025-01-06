import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getAssets } from '~/api/wallet'
import { Card, Icon, Text, XStack, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { formatDecimal } from '~/lib/utils'

export const AssetCard: FC = () => {
  const { data } = useRequest(getAssets)
  const { t } = useTranslation()
  return (
    <Card fd="row" ai="center">
      <YStack gap="$sm" f={1}>
        <Text>{t("home.wallet")}</Text>
        <XStack ai="baseline" gap="$xs">
          <Text col="$primary" fos={28} lh={32} mr="$xs" fow="900">
            {formatDecimal(data?.userWalletDetail.fundsAccount.available ?? 0)}
          </Text>
          <Text>USD</Text>
        </XStack>
      </YStack>
      <Icon name="chevronRight" />
    </Card>
  )
}
