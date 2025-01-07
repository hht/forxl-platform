import { useIsFocused } from '@react-navigation/native'
import { useInfiniteScroll } from 'ahooks'
import dayjs from 'dayjs'
import { Stack } from 'expo-router'
import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList, Platform } from 'react-native'

import { getNews } from '~/api/dashboard'
import { Screen, Text, XStack } from '~/components'
import colors from '~/theme/colors'
import { AssetCard } from '~/widgets/(home)/tabs/dashboard/asset-card'
import { ListHeaderComponent, ListItem } from '~/widgets/(home)/tabs/dashboard/list'
import {
    BrandTitle, BreadCrumb, CustomerService, DefaultScreenOptions, NativeStackNavigationOptions,
    Notifier
} from '~/widgets/shared/header'
import { Gradient } from '~/widgets/shared/shape'

const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerTitle: () => <BrandTitle />,
  headerLeft: () => <BreadCrumb />,
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerRight: () => (
    <XStack gap={24} px="$md">
      <Notifier />
      <CustomerService />
    </XStack>
  ),
}

const renderItem = ({
  item,
  index,
}: {
  item: Awaited<ReturnType<typeof getNews>>["list"][number]
  index: number
}) => {
  return <ListItem item={item} index={index} />
}

const ListFooterComponent: FC<{ loading: boolean }> = ({ loading }) => {
  const { t } = useTranslation()
  return (
    <XStack
      gap="$md"
      px="$md"
      bblr="$md"
      bbrr="$md"
      bbw={1}
      bbc="$border"
      blw={1}
      brw={1}
      brc="$border"
      blc="$border"
      bc="$card"
      mb="$md"
      ai="center"
      w="100%"
      jc="center"
      pb="$md"
    >
      {loading ? (
        <Fragment>
          <ActivityIndicator color={colors.tertiary} />
          <Text col="$tertiary" fow="700">
            {t("message.loading")}
          </Text>
        </Fragment>
      ) : null}
    </XStack>
  )
}

export default function Page() {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const { data, loading, loadMore, loadingMore } = useInfiniteScroll<{
    list: Awaited<ReturnType<typeof getNews>>["list"]
    nextId?: number
  }>(
    (d) => {
      if (!isFocused && Platform.OS === "web") {
        return Promise.resolve({ list: d?.list ?? [], nextId: d?.nextId ?? 1 })
      }
      return getNews({
        page: d?.nextId ?? 1,
        date: dayjs().subtract(3, "d").format("YYYY-MM-DD"),
      })
    },
    {
      reloadDeps: [isFocused],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )

  return (
    <Screen pb={0} gap={0}>
      <Stack.Screen options={ScreenOptions} />
      <Gradient />
      <AssetCard />
      <FlatList
        data={data?.list}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
      ></FlatList>
    </Screen>
  )
}
