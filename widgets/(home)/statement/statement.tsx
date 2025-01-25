import { useIsFocused } from "@react-navigation/native"
import { useInfiniteScroll, useMount } from "ahooks"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"
import { Tabs as CollapsibleTabs } from "react-native-collapsible-tab-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Filter } from "./filter"
import { RequestStatement } from "./form"
import { StatementItem } from "./list-item"

import { getWalletStatement, sendStatement } from "~/api/wallet"
import { Button, Tabs, toast, XStack, YStack } from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useRequest } from "~/hooks/useRequest"
import { useStatementStore } from "~/hooks/useStore"
import { i18n } from "~/lib/utils"
import colors from "~/theme/colors"
import { AccountCard } from "~/widgets/(home)/statement/account-card"
import { ListEmptyComponent, ListFooterComponent } from "~/widgets/shared/list"

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
  const tabs = useMemo(() => {
    return [t("wallet.activity"), t("wallet.requestStatement")]
  }, [t])
  const { bottom } = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const { current, date, activeIndex } = useStatementStore()
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
  useMount(() => {
    useStatementStore.setState({ months: [], language: i18n.language })
  })
  return (
    <CollapsibleTabs.Container
      renderHeader={AccountCard}
      pagerProps={{ scrollEnabled: false }}
      snapThreshold={null}
      cancelLazyFadeIn={true}
      headerContainerStyle={{
        backgroundColor: colors.background,
      }}
      renderTabBar={({ onTabPress }) => (
        <YStack p="$md" pb={0}>
          <XStack pb={0} bbc="$border" bbw={1}>
            <Tabs
              data={tabs}
              activeIndex={activeIndex}
              onChange={(index) => {
                useStatementStore.setState({ activeIndex: index })
                if (index === 0) {
                  useStatementStore.setState({
                    months: [],
                    language: i18n.language,
                  })
                }
                onTabPress(tabs[index])
              }}
            />
          </XStack>
          <Filter />
        </YStack>
      )}
    >
      <CollapsibleTabs.Tab name={t("wallet.activity")}>
        <CollapsibleTabs.FlatList
          data={data?.list ?? []}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
          }}
          keyExtractor={keyExtractor}
          onEndReached={loadMore}
          overScrollMode="never"
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<ListFooterComponent loading={loadingMore} />}
        />
      </CollapsibleTabs.Tab>
      <CollapsibleTabs.Tab name={t("wallet.requestStatement")}>
        <CollapsibleTabs.ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
        >
          <RequestStatement />
        </CollapsibleTabs.ScrollView>
        <YStack
          p="$md"
          pb={bottom + 16}
          zIndex={20}
          bc="$background"
          pos="absolute"
          bottom={0}
          w="100%"
        >
          <Button
            isLoading={loading}
            disabled={!months?.length || loading}
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
      </CollapsibleTabs.Tab>
    </CollapsibleTabs.Container>
  )
}
