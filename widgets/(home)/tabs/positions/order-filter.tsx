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
import { DEVICE_WIDTH, t, uuid } from "~/lib/utils"

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
      from: state.from,
      to: state.to,
      options: state.options,
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
  useEffect(() => {
    if (filters.options) {
      setCurrent(filters.options)
    }
    if (filters.from || filters.to) {
      setDateRange({ from: filters.from, to: filters.to })
    } else {
      setDateRange({})
      setRange(undefined)
    }
  }, [filters])
  console.log(filters)
  return (
    <Fragment>
      <XStack
        onPress={() => {
          ref.current?.present()
        }}
        hitSlop={16}
      >
        <Icon name="filter" size={20} />
        {filters.from || filters.to || filters.options ? (
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
                    title
                    col={
                      (current ?? filters.options) === option
                        ? "$primary"
                        : "$text"
                    }
                  >
                    {t(`positions.${option}`)}
                  </Text>
                  {(current ?? filters.options) === option ? (
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
                  setDate(toDateId(getDate(date).add(v, "month").toDate()))
                }}
                calendarActiveDateRanges={[
                  {
                    startId:
                      range === "from" && (from ?? filters.from)
                        ? toDateId(getDate(from ?? filters.from).toDate())
                        : range === "to" && (to ?? filters.to)
                          ? toDateId(getDate(to ?? filters.to).toDate())
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
            {(current ?? filters.options) === "customPeriod" ? (
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
                    if (from ?? filters.from) {
                      setDate(toDateId(getDate(from ?? filters.from).toDate()))
                    }
                  }}
                >
                  <Text>
                    {from || filters.from
                      ? getDate(from ?? filters.from).format("MMM DD, YY")
                      : // eslint-disable-next-line react-compiler/react-compiler
                        ""}
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
                    if (to ?? filters.to) {
                      setDate(toDateId(getDate(to ?? filters.to).toDate()))
                    }
                  }}
                >
                  <Text>
                    {to || filters.to
                      ? getDate(to ?? filters.to).format("MMM DD, YY")
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
                  current === "customPeriod" &&
                  (!(from ?? filters.from) ||
                    !(to ?? filters.to) ||
                    (from ?? filters.from)! > (to ?? filters.to)!)
                }
                onPress={() => {
                  useOrderStore.setState({
                    ...getFilters({
                      options: current ?? filters.options,
                      from: from ?? filters.from,
                      to: to ?? filters.to,
                    }),
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
