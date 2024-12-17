import { toDateId, useDateRange } from '@marceloterreiro/flash-calendar'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Calendar, YStack } from '~/components'
import { animateOnNextFrame } from '~/utils'

const getCalendarDayFormat = (date: Date) => date.getDate().toString()
const getCalendarWeekDayFormat = (date: Date) =>
  date.toLocaleDateString("en", { weekday: "short" }).toUpperCase()

export default function Page() {
  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange()
  const insets = useSafeAreaInsets()
  const [date, setDate] = useState(toDateId(new Date()))
  return (
    <YStack f={1} bc="$background" pt={insets.top}>
      <Calendar
        calendarDayHeight={52}
        calendarFormatLocale="zh"
        getCalendarDayFormat={getCalendarDayFormat}
        getCalendarWeekDayFormat={getCalendarWeekDayFormat}
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarMonthId={date}
        onCalendarMonthChange={(v) => {
          animateOnNextFrame()
          setDate(toDateId(dayjs(date).add(v, "month").toDate()))
        }}
        calendarRowVerticalSpacing={6}
        onCalendarDayPress={onCalendarDayPress}
      />
    </YStack>
  )
}
