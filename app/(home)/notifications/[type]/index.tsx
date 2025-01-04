import { FlashList } from '@shopify/flash-list'
import dayjs from 'dayjs'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { getNotifications, readAllNotifications, readNotification } from '~/api/notifications'
import { Screen, Text, XStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import colors from '~/theme/colors'
import { ListEmptyComponent, ListItem } from '~/widgets/(home)/notifications/list'

export default function Page() {
  const { t, i18n } = useTranslation()
  const { type } = useLocalSearchParams<{ type: string }>()
  const { data, loading, refresh } = useRequest(() => getNotifications(type), {
    refreshDeps: [i18n.language, type],
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
      <FlashList
        data={data?.resultList}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={() => (
          <ListEmptyComponent loading={loading} type={Number(type)} />
        )}
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
