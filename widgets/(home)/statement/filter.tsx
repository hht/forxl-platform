import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useRequest } from "ahooks"
import { Fragment, useRef } from "react"
import { useTranslation } from "react-i18next"

import { getWalletCategories } from "~/api/wallet"
import {
  BottomSheet,
  Icon,
  ListItem,
  Picker,
  Row,
  Text,
  XStack,
  YStack,
} from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useStatementStore } from "~/hooks/useStore"
import { dayjs, I18NResource } from "~/lib/utils"

const getLocaleLabel = (item: number): I18NResource => {
  switch (item) {
    case 0:
      return "wallet.all"
    case 1:
      return "wallet.addFunds"
    case 2:
      return "wallet.withdrawFunds"
    case 3:
      return "wallet.returnFunds"
    case 4:
      return "wallet.closingProfit"
    case 5:
      return "wallet.closingLoss"
    case 6:
      return "wallet.referralBonuses"
    case 7:
      return "wallet.leadingBonuses"
    case 8:
      return "wallet.otherBonuses"
    case 9:
      return "wallet.payment"
    default:
      return "wallet.all"
  }
}

const currentYear = dayjs().year()
const YEARS = Array.from({ length: 21 }, (_, index) => {
  const year = currentYear - 10 + index
  return {
    label: `${year}`,
    value: year,
  }
})

export const Filter = () => {
  const { t } = useTranslation()
  const { date, current, activeIndex } = useStatementStore()
  const { data } = useRequest(getWalletCategories, {})
  const dateRef = useRef<BottomSheetModal>(null)
  const typeRef = useRef<BottomSheetModal>(null)
  if (activeIndex === 1) {
    return (
      <XStack h={56} gap={12} ai="center">
        <Text heading bold>
          {t("wallet.requestStatement")}
        </Text>
      </XStack>
    )
  }
  return (
    <Fragment>
      <XStack h={56} gap={12} ai="center">
        <Row
          boc="$border"
          bw={1}
          gap="$xs"
          br="$sm"
          px={12}
          py={10}
          onPress={() => dateRef.current?.present()}
        >
          <Text pr="$md">{t("calendar.period")}</Text>
          <Text>{getDate(date ?? new Date()).format("MMM YY")}</Text>
          <XStack rotate="90deg">
            <Icon name="chevronRight" size={16} />
          </XStack>
        </Row>
        <Row
          f={1}
          boc="$border"
          bw={1}
          br="$sm"
          px={12}
          py={10}
          onPress={() => typeRef.current?.present()}
        >
          <Text f={1} col="$secondary">
            {t("wallet.category")}
          </Text>
          <Text className="text-base font-normal">
            {t(getLocaleLabel(current ?? 0) as any)}
          </Text>
          <XStack rotate="90deg">
            <Icon name="chevronRight" size={16} />
          </XStack>
        </Row>
      </XStack>
      <BottomSheet ref={dateRef} title="">
        <XStack px={50}>
          <YStack f={1}>
            <Picker
              value={date ? dayjs(date).month() : dayjs().month()}
              onValueChanged={(index) => {
                useStatementStore.setState({
                  date: getDate(date ?? new Date())
                    .month(index as number)
                    .toDate(),
                })
              }}
              data={dayjs
                .months()
                .map((it, index) => ({ label: it, value: index }))}
            ></Picker>
          </YStack>
          <YStack f={1}>
            <Picker
              value={date ? dayjs(date).year() : dayjs().year()}
              onValueChanged={(v) => {
                useStatementStore.setState({
                  date: getDate(date ?? new Date())
                    .year(v as number)
                    .toDate(),
                })
              }}
              data={YEARS}
            ></Picker>
          </YStack>
        </XStack>
      </BottomSheet>
      <BottomSheet ref={typeRef} title={t("wallet.category")}>
        <YStack p="$md">
          {data?.map((it) => (
            <ListItem
              title={it.desc as string}
              key={it.category}
              col={it.category === current ? "$primary" : "$text"}
              onPress={() => {
                useStatementStore.setState({ current: it.category })
                typeRef.current?.dismiss()
              }}
              isLink={false}
              addonAfter={
                it.category === current ? (
                  <Icon name="checked" size={16}></Icon>
                ) : null
              }
            />
          ))}
        </YStack>
      </BottomSheet>
    </Fragment>
  )
}
