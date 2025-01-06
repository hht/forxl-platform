import dayjs from 'dayjs'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { Figure, Icon, Text, XStack, YStack } from '~/components'
import { getRecentDate } from '~/hooks/useLocale'
import colors from '~/theme/colors'

export const ListItem = ({
  item,
  dateVisible,
  onPress,
}: {
  item: Message
  dateVisible?: boolean
  onPress?: () => void
}) => {
  const { title, content, createTime } = item
  return (
    <YStack p="$md" gap="$md" onPress={onPress}>
      {dateVisible && (
        <Text caption col="$secondary">
          {getRecentDate(createTime)}
        </Text>
      )}
      <XStack gap={12}>
        <XStack
          w={36}
          h={36}
          ai="center"
          jc="center"
          bw={1}
          bc="$card"
          boc="$border"
          br={18}
          pos="relative"
        >
          <Icon name="email" size={18} color={colors.text} />
          {item.isRead ? null : (
            <XStack
              w={8}
              h={8}
              bc="$destructive"
              br={4}
              bw={1}
              boc="$text"
              pos="absolute"
              t={0}
              r={0}
            ></XStack>
          )}
        </XStack>
        <YStack gap="$sm" f={1}>
          <Text col="$secondary">{title}</Text>
          <Text head>{content}</Text>
          <Text col="$tertiary">{dayjs(createTime).format("HH:mm:ss")}</Text>
        </YStack>
      </XStack>
    </YStack>
  )
}

export const ListEmptyComponent: FC<{ loading: boolean; type: number }> = ({
  loading,
  type = 0,
}) => {
  const { t } = useTranslation()
  if (loading) {
    return (
      <YStack ai="center" jc="center" h="100%" gap="$md">
        <ActivityIndicator color={colors.tertiary} />
      </YStack>
    )
  }
  return (
    <YStack ai="center" jc="center" h="100%" gap="$md">
      <Figure name="mailBox" width={90} height={90} />
      <Text col="$secondary">
        {t(
          type === 0 ? "notifications.emptySystem" : "notifications.emptyTrade"
        )}
      </Text>
    </YStack>
  )
}
