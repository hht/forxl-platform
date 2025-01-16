import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { Figure, Text, XStack, YStack } from '~/components'
import colors from '~/theme/colors'

export const ListEmptyComponent: FC<{ loading: boolean; title?: string }> = ({
  loading,
  title,
}) => {
  const { t } = useTranslation()
  if (loading) {
    return (
      <YStack ai="center" jc="center" gap="$md" h="100%" py={48}>
        <Text col="$tertiary">{t("message.loading")}</Text>
      </YStack>
    )
  }
  return (
    <YStack ai="center" jc="center" gap="$md" py={48}>
      <Figure name="empty" width={90} height={90} />
      <Text col="$tertiary">{title ?? t("message.empty")}</Text>
    </YStack>
  )
}

export const ListFooterComponent: FC<{ loading: boolean }> = ({ loading }) => {
  const { t } = useTranslation()
  if (!loading) return null
  return (
    <XStack gap="$md" p="$md" ai="center" w="100%" jc="center" pb="$md">
      <ActivityIndicator color={colors.tertiary} />
      <Text col="$tertiary" bold>
        {t("message.loading")}
      </Text>
    </XStack>
  )
}
