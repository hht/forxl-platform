import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll, useInViewport } from "ahooks"
import { FC, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Dimensions, FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Filter } from "./filter"
import { RequestStatement } from "./form"
import { StatementItem } from "./list-item"

import { getWalletStatement, sendStatement } from "~/api/wallet"
import {
  Button,
  ListItem,
  ScrollView,
  Tabs,
  toast,
  XStack,
  YStack,
} from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useRequest } from "~/hooks/useRequest"
import { useStatementStore } from "~/hooks/useStore"
import { i18n } from "~/lib/utils"
import { AccountCard } from "~/widgets/(home)/statement/account-card"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

const { width: DEVICE_WIDTH } = Dimensions.get("window")

const Loader: FC<{ loading: boolean; loadMore: () => void }> = ({
  loading,
  loadMore,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView] = useInViewport(ref)
  useEffect(() => {
    if (isInView && !loading) {
      loadMore()
    }
  }, [isInView, loadMore, loading])
  return (
    <div ref={ref}>
      <ListFooterComponent loading={loading} />
    </div>
  )
}

const keyExtractor = (
  item: Awaited<ReturnType<typeof getWalletStatement>>["list"][number]
) => item.id.toString()

const renderItem = ({
  item,
}: {
  item: Awaited<ReturnType<typeof getWalletStatement>>["list"][number]
}) => <StatementItem data={item} />

export const Statement = () => {
  const { t } = useTranslation()
  const ref = useRef<ScrollView>(null)
  const { bottom } = useSafeAreaInsets()
  const { current, date, activeIndex } = useStatementStore()
  useEffect(() => {
    ref.current?.scrollTo({
      x: activeIndex * DEVICE_WIDTH,
      y: 0,
      animated: true,
    })
  }, [activeIndex])
  const isFocused = useIsFocused()
  const { data, loadMore, loadingMore } = useInfiniteScroll<{
    list: Awaited<ReturnType<typeof getWalletStatement>>["list"]
    nextId?: number
  }>(
    (d) => {
      return getWalletStatement({
        currentPage: d?.nextId ?? 1,
        stateCategory: current ?? 0,
        time: getDate(date ?? undefined).format("YYYY-MM"),
      })
    },
    {
      reloadDeps: [isFocused, current, date],
      isNoMore: (d) => d?.nextId === undefined,
    }
  )
  const { months, language } = useStatementStore()
  const { loading, run } = useRequest(sendStatement, {
    manual: true,
    onSuccess: (data) => {
      toast.show(t("wallet.sendStatementSuccessful"))
    },
  })
  return (
    <ScrollView f={1}>
      <AccountCard />
      <YStack
        style={{ position: "sticky", top: -1, zIndex: 1 }}
        bg="$background"
        p="$md"
        pb={0}
      >
        <XStack p="$md" pb={0} bbc="$border" bbw={1}>
          <Tabs
            data={[t("wallet.activity"), t("wallet.requestStatement")]}
            activeIndex={activeIndex}
            onChange={(index) => {
              if (index === 0) {
                useStatementStore.setState({
                  months: [],
                  language: i18n.language,
                })
              }
              useStatementStore.setState({ activeIndex: index })
            }}
          />
        </XStack>
        <Filter />
      </YStack>
      <YStack f={1}>
        <ScrollView
          ref={ref}
          f={1}
          horizontal
          pagingEnabled
          scrollEnabled={false}
        >
          <FlatList
            style={{ width: DEVICE_WIDTH }}
            data={data?.list ?? []}
            contentContainerStyle={{ flexGrow: 1, flex: 1 }}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            centerContent={data?.list.length === 0}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Loader loading={loadingMore} loadMore={loadMore} />
            }
          />
          <YStack pos="relative" f={1}>
            <ScrollView
              style={{ width: DEVICE_WIDTH }}
              f={1}
              showsVerticalScrollIndicator={false}
            >
              <RequestStatement />
            </ScrollView>
            <YStack p="$md" pb={bottom + 16} w="100%">
              <Button
                onPress={() => {
                  if (months?.length) {
                    const { year, month } = months
                      ?.map((it) => it.split("-"))
                      .map(([a, b]) => ({ year: a, month: b }))
                      .reduce(
                        (acc, curr) => ({
                          year: curr.year,
                          month: acc.month.concat([curr.month]),
                        }),
                        { year: "", month: [] as string[] }
                      )
                    run({ year, months: month, lan: language })
                  }
                }}
              >
                {t("action.submitRequest")}
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </ScrollView>
  )
}
