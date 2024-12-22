import { FlashList } from '@shopify/flash-list'
import dayjs from 'dayjs'
import { Stack } from 'expo-router'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { getNotifications, readAllNotifications, readNotification } from '~/api/notifications'
import { Figure, Icon, Screen, Text, XStack, YStack } from '~/components'
import { getDate } from '~/hooks/useLocale'
import { useRequest } from '~/hooks/useRequest'
import colors from '~/theme/colors'

const ListItem = ({
  item,
  dateVisible,
  onPress,
}: {
  item: Message
  dateVisible?: boolean
  onPress?: () => void
}) => {
  const { title, content, createTime } = item
  const { t } = useTranslation()
  const formatDate = useCallback(
    (date?: number) => {
      const dayjsDate = getDate(date)
      if (dayjsDate.isToday()) {
        return t("notifications.today")
      } else if (dayjsDate.isYesterday()) {
        return t("notifications.yesterday")
      } else {
        return dayjsDate.format("YYYY-MM-DD")
      }
    },
    [t]
  )
  return (
    <YStack p="$md" gap="$md" onPress={onPress}>
      {dateVisible && (
        <Text caption col="$secondary">
          {formatDate(createTime)}
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

const ListEmptyComponent: FC<{ loading: boolean }> = ({ loading }) => {
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
      <Figure name="empty" width={90} height={90} />
      <Text col="$secondary">{t("notifications.empty")}</Text>
    </YStack>
  )
}

export default function Page() {
  const { t, i18n } = useTranslation()

  const { data, loading, refresh } = useRequest(getNotifications, {
    refreshDeps: [i18n.language],
    refreshOnWindowFocus: true,
  })
  const { run } = useRequest(readNotification, {
    manual: true,
    onSuccess: refresh,
  })

  const { run: readAll, loading: readingNotifications } = useRequest(
    () => readAllNotifications(),
    {
      manual: true,
      onSuccess: refresh,
    }
  )

  const unRead =
    (data?.resultList?.filter((item) => !item.isRead)?.length ?? 0) > 0
  return (
    <Screen px={0}>
      <Stack.Screen
        options={{
          title: t("notifications.title"),
          headerRight: () =>
            unRead ? (
              <XStack p={12} onPress={readAll}>
                {readingNotifications ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text col="$primary">{t("notifications.allRead")}</Text>
                )}
              </XStack>
            ) : null,
        }}
      />
      <FlashList
        data={data?.resultList}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={() => <ListEmptyComponent loading={loading} />}
        overrideProps={{
          contentContainerStyle: {
            flexGrow: 1,
          },
        }}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            onPress={() => {
              if (item.id && !item.isRead) {
                run(item.id)
              }
            }}
            dateVisible={
              dayjs(item.createTime).format("YYYY-MM-DD") !==
              dayjs(data?.resultList?.[index - 1]?.createTime).format(
                "YYYY-MM-DD"
              )
            }
          />
        )}
      />
    </Screen>
  )
}
