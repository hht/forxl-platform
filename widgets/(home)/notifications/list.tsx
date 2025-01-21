import { Icon, Text, XStack, YStack } from "~/components"
import { getDate, getRecentDate } from "~/hooks/useLocale"
import colors from "~/theme/colors"

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
          <Text title>{content}</Text>
          <Text col="$tertiary">{getDate(createTime).format("HH:mm:ss")}</Text>
        </YStack>
      </XStack>
    </YStack>
  )
}
