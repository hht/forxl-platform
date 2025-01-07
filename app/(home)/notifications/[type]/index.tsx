import { useIsFocused } from '@react-navigation/native'
import { useInfiniteScroll } from 'ahooks'
import dayjs from 'dayjs'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList, Platform, RefreshControl } from 'react-native'

import { getNotifications, readAllNotifications, readNotification } from '~/api/notifications'
import { Screen, Text, XStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import colors from '~/theme/colors'
import { ListEmptyComponent, ListItem } from '~/widgets/(home)/notifications/list'

export default function Page() {
  const { t, i18n } = useTranslation()
  const { type } = useLocalSearchParams<{ type: string }>()
  const isFocused = useIsFocused()
  const { data, loading, loadMore, reload, loadingMore } = useInfiniteScroll<{
    list: Message[]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }

      return getNotifications({
        currentPage: d?.nextId ?? 1,
        type,
      })
    },
    {
      reloadDeps: [isFocused, type, i18n.language],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  const { run } = useRequest(readNotification, {
    manual: true,
    onSuccess: reload,
  })

  const { run: readAll, loading: readingNotifications } = useRequest(
    () => readAllNotifications(),
    {
      manual: true,
      onSuccess: reload,
    }
  )

  const ListFooterComponent = useCallback(() => {
    if (!data?.list.length) return null
    return (
      <XStack
        gap="$md"
        p="$md"
        ai="center"
        w="100%"
        jc="center"
        pb={loading || loadingMore ? "$md" : 0}
      >
        {loading || loadingMore ? (
          <ActivityIndicator color={colors.tertiary} />
        ) : null}
        <Text col="$tertiary" fow="700">
          {loading
            ? t("home.loading")
            : loadingMore
              ? t("home.loadingMore")
              : ""}
        </Text>
      </XStack>
    )
  }, [loading, loadingMore, t, data?.list.length])

  const unRead = (data?.list?.filter((item) => !item.isRead)?.length ?? 0) > 0

  return (
    <Screen px={0}>
      <Stack.Screen
        options={{
          title:
            type === "0" ? t("notifications.system") : t("notifications.trade"),
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
      <FlatList
        data={data?.list}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            tintColor={colors.secondary}
            refreshing={loading}
            onRefresh={reload}
          />
        }
        onRefresh={reload}
        keyExtractor={(item) => item.id!.toString()}
        contentContainerStyle={{
          flexGrow: 1,
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
              dayjs(data?.list?.[index - 1]?.createTime).format("YYYY-MM-DD")
            }
          />
        )}
        onEndReached={loadMore}
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type={Number(type)} />
        )}
        ListFooterComponent={ListFooterComponent}
      />
    </Screen>
  )
}
