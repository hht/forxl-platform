import { router } from 'expo-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { Card, Icon, Text, XStack, YStack } from '~/components'
import { useStatisticsStore } from '~/hooks/useStore'
import { formatDecimal } from '~/lib/utils'

export const AssetCard: FC = () => {
  const available = useStatisticsStore((state) => state.available, shallow)
  const { t } = useTranslation()
  return (
    <Card fd="row" ai="center">
      <YStack gap="$sm" f={1}>
        <Text>{t("wallet.title")}</Text>
        <XStack ai="baseline" gap="$xs">
          <Text col="$primary" head mr="$xs" bold>
            {formatDecimal(available ?? 0)}
          </Text>
          <Text>USD</Text>
        </XStack>
      </YStack>
      <YStack
        hitSlop={16}
        onPress={() => {
          router.push("/(home)/tabs/wallet")
        }}
      >
        <Icon name="chevronRight" />
      </YStack>
    </Card>
  )
}
