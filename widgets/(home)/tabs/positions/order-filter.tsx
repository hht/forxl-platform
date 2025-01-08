import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { toDateId } from "@marceloterreiro/flash-calendar"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import {
  BottomSheet,
  Button,
  Calendar,
  Icon,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "~/components"
import { getDate } from "~/hooks/useLocale"
import { OPTIONS, useOrderStore } from "~/hooks/useStore"
import { dayjs, DEVICE_WIDTH, t, uuid } from "~/lib/utils"

const getCalendarDayFormat = (date: Date) => date.getDate().toString()
const getCalendarWeekDayFormat = (date: Date) =>
  date.toLocaleDateString("en", { weekday: "short" }).toUpperCase()

const getFilters = (filter: {
  options?: (typeof OPTIONS)[number]
  from?: number
  to?: number
}) => {
  const now = getDate()
  switch (filter.options) {
    case "today":
      return {
        options: filter.options,
        from: now.startOf("day").valueOf(),
        to: now.endOf("day").valueOf(),
      }
    case "lastWeek":
      return {
        options: filter.options,
        from: now.subtract(1, "week").startOf("week").valueOf(),
        to: now.valueOf(),
      }
    case "lastMonth":
      return {
        options: filter.options,
        from: now.subtract(1, "month").startOf("month").valueOf(),
        to: now.endOf("month").valueOf(),
      }
    case "last3Months":
      return {
        options: filter.options,
        from: now.subtract(3, "month").startOf("month").valueOf(),
        to: now.endOf("month").valueOf(),
      }
    case "last6Months":
      return {
        options: filter.options,
        from: now.subtract(6, "month").startOf("month").valueOf(),
        to: now.endOf("month").valueOf(),
      }
    case "lastYear":
      return {
        options: filter.options,
        from: now.subtract(1, "year").startOf("year").valueOf(),
        to: now.endOf("year").valueOf(),
      }
    case "customPeriod":
      return {
        options: filter.options,
        from: getDate(filter.from).valueOf(),
        to: getDate(filter.to).valueOf(),
      }
    default:
      return {
        options: undefined,
        from: undefined,
        to: undefined,
      }
  }
}

export const OrderFilter: FC = () => {
  const { bottom } = useSafeAreaInsets()
  const [current, setCurrent] = useState<(typeof OPTIONS)[number] | undefined>(
    undefined
  )
  const filters = useOrderStore(
    (state) => ({
      current: {
        from: state.from,
        to: state.to,
        options: state.options,
      },
    }),
    shallow
  )
  const [{ from, to }, setDateRange] = useState<{
    from?: number
    to?: number
  }>({})
  const ref = useRef<BottomSheetModal>(null)
  const scrollRef = useRef<ScrollView>(null)
  const [date, setDate] = useState(toDateId(new Date()))
  const [range, setRange] = useState<"from" | "to" | undefined>(undefined)
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: (range ? 1 : 0) * DEVICE_WIDTH,
      y: 0,
      animated: true,
    })
  }, [range])
  return (
    <Fragment>
      <XStack
        onPress={() => {
          ref.current?.present()
        }}
        hitSlop={16}
      >
        <Icon name="filter" size={20} />
        {filters.current.from ||
        filters.current.to ||
        filters.current.options ? (
          <XStack bc="$warning" pos="absolute" t={0} r={0} w={4} h={4} br={3} />
        ) : null}
      </XStack>
      <BottomSheet
        ref={ref}
        title={t("positions.filters.title")}
        onDismiss={() => {
          if (range) {
            setRange(undefined)
            return
          }
          ref.current?.dismiss()
        }}
        onChange={(index) => {
          if (index === -1) {
            setRange(undefined)
            setDateRange({})
            setCurrent(undefined)
          }
        }}
      >
        <YStack h={500 + bottom} pb={bottom + 16}>
          <ScrollView
            horizontal
            f={1}
            ref={scrollRef}
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          >
            <YStack w={DEVICE_WIDTH}>
              {OPTIONS.map((option, index) => (
                <XStack
                  key={index}
                  px="$md"
                  w="100%"
                  h={50}
                  ai="center"
                  jc="space-between"
                  onPress={() => {
                    setCurrent(option)
                  }}
                  hitSlop={16}
                >
                  <Text
                    fos={15}
                    lh={18}
                    col={
                      (current ?? filters.current.options) === option
                        ? "$primary"
                        : "$text"
                    }
                  >
                    {t(`positions.${option}`)}
                  </Text>
                  {(current ?? filters.current.options) === option ? (
                    <Icon name="checked" size={16} />
                  ) : null}
                </XStack>
              ))}
            </YStack>
            <YStack w={DEVICE_WIDTH} p="$md">
              <Calendar
                calendarDayHeight={48}
                calendarFormatLocale="zh"
                getCalendarDayFormat={getCalendarDayFormat}
                getCalendarWeekDayFormat={getCalendarWeekDayFormat}
                calendarMonthId={date}
                onCalendarMonthChange={(v) => {
                  setDate(toDateId(dayjs(date).add(v, "month").toDate()))
                }}
                calendarActiveDateRanges={[
                  {
                    startId:
                      range === "from"
                        ? toDateId(dayjs(from).toDate())
                        : range === "to"
                          ? toDateId(dayjs(to).toDate())
                          : undefined,
                  },
                ]}
                calendarRowVerticalSpacing={6}
                onCalendarDayPress={(date) => {
                  if (range === "from") {
                    if (to && getDate(date).isAfter(getDate(to))) {
                      return
                    }
                    setDateRange({ from: getDate(date).valueOf(), to })
                  }
                  if (range === "to") {
                    if (from && getDate(date).isBefore(getDate(from))) {
                      return
                    }
                    setDateRange({ from, to: getDate(date).valueOf() })
                  }
                }}
              />
            </YStack>
          </ScrollView>
          <YStack gap="$lg">
            {current === "customPeriod" ? (
              <XStack px="$md" ai="center" gap="$sm">
                <XStack
                  boc={range === "from" ? "$text" : "$border"}
                  bw={1}
                  h={32}
                  br="$sm"
                  ai="center"
                  f={1}
                  jc="center"
                  onPress={() => {
                    setRange("from")
                    if (from) {
                      setDate(toDateId(dayjs(from).toDate()))
                    }
                  }}
                >
                  <Text>
                    {from || filters.current.from
                      ? getDate(from ?? filters.current.from).format(
                          "MMM DD, YY"
                        )
                      : // eslint-disable-next-line react-compiler/react-compiler
                        useOrderStore.getState().from}
                  </Text>
                </XStack>
                <XStack w={7} h={1} bc="$border" />
                <XStack
                  boc={range === "to" ? "$text" : "$border"}
                  bw={1}
                  h={32}
                  br="$sm"
                  ai="center"
                  f={1}
                  jc="center"
                  onPress={() => {
                    setRange("to")
                    if (to) {
                      setDate(toDateId(dayjs(to).toDate()))
                    }
                  }}
                >
                  <Text>
                    {to || filters.current.to
                      ? getDate(to || filters.current.to).format("MMM DD, YY")
                      : ""}
                  </Text>
                </XStack>
              </XStack>
            ) : null}
            <XStack px="$md" ai="center" gap="$sm">
              <Button
                type="accent"
                f={1}
                size="$md"
                onPress={() => {
                  useOrderStore.setState({
                    options: undefined,
                    from: undefined,
                    to: undefined,
                    reloadKey: uuid(),
                  })
                  ref.current?.dismiss()
                }}
              >
                {t("positions.clear")}
              </Button>
              <Button
                f={1}
                size="$md"
                disabled={
                  current === "customPeriod" && (!from || !to || from > to)
                }
                onPress={() => {
                  useOrderStore.setState({
                    ...getFilters({ options: current, from, to }),
                    reloadKey: uuid(),
                  })
                  ref.current?.dismiss()
                }}
              >
                {t("action.apply")}
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </BottomSheet>
    </Fragment>
  )
}
