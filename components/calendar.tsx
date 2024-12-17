import {
    Calendar as CalendarBase, CalendarProps, CalendarTheme, useCalendar
} from '@marceloterreiro/flash-calendar'
import { FC } from 'react'
import { XStack, YStack } from 'tamagui'

import { Icon } from './icon'
import { Text } from './text'

import { dayjs } from '~/lib/utils'
import colors from '~/theme/colors'

const ACCENT_COLOR = "#13261E"

const theme: CalendarTheme = {
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: ACCENT_COLOR,
    },
  },
  itemWeekName: {
    content: { color: colors.tertiary, fontSize: 13, fontWeight: 600 },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? ACCENT_COLOR : "transparent",
        borderRadius: 50,
      },
      content: {
        color: "#ffffff",
        fontSize: 20,
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderRadius: 50,
        backgroundColor: isPressed ? ACCENT_COLOR : "transparent",
        borderWidth: 1,
        borderColor: ACCENT_COLOR,
      },
      content: {
        color: colors.text,
        fontSize: 20,
      },
    }),
    active: ({
      isEndOfRange,
      isStartOfRange,
      isRangeValid,
      isStartOfMonth,
      isEndOfMonth,
    }) => ({
      container: {
        backgroundColor: ACCENT_COLOR,
        borderWidth: 0,
        borderTopLeftRadius: isStartOfRange || isStartOfMonth ? 50 : 0,
        borderBottomLeftRadius: isStartOfRange || isStartOfMonth ? 50 : 0,
        borderTopRightRadius:
          isEndOfRange || isEndOfMonth || (isStartOfRange && !isRangeValid)
            ? 50
            : 0,
        borderBottomRightRadius:
          isEndOfRange || isEndOfMonth || (isStartOfRange && !isRangeValid)
            ? 50
            : 0,
      },
      content: {
        color: colors.primary,
        fontSize: 20,
      },
    }),
  },
}

export const Calendar: FC<
  CalendarProps & { onCalendarMonthChange: (v: number) => void }
> = ({ onCalendarMonthChange, ...props }) => {
  const { weekDaysList, weeksList } = useCalendar(props)
  return (
    <XStack bc="$accent" py="$md" w="100%">
      <YStack gap={props.calendarRowVerticalSpacing ?? 6} w="100%">
        {/* Replaces `Calendar.Row.Month` with a custom implementation */}
        <XStack px="$md" ai="center" jc="space-between" w="100%">
          <Text fos={17} lh={24} ff="Inter" fow={700}>
            {dayjs(props.calendarMonthId).format("MMMM YYYY")}
          </Text>
          <XStack gap="$md" ai="center">
            <XStack onPress={() => onCalendarMonthChange(-1)}>
              <Icon name="chevronLeft" color={colors.primary} size={24} />
            </XStack>
            <XStack onPress={() => onCalendarMonthChange(1)}>
              <Icon name="chevronRight" color={colors.primary} size={24} />
            </XStack>
          </XStack>
        </XStack>

        <CalendarBase.Row.Week theme={theme.rowWeek}>
          {weekDaysList.map((day, i) => (
            <CalendarBase.Item.WeekName
              height={36}
              key={i}
              theme={theme.itemWeekName}
            >
              {day}
            </CalendarBase.Item.WeekName>
          ))}
        </CalendarBase.Row.Week>
        {weeksList.map((week, i) => (
          <CalendarBase.Row.Week key={i} theme={theme.rowWeek}>
            {week.map((day) => {
              if (day.isDifferentMonth) {
                return (
                  <CalendarBase.Item.Day.Container
                    dayHeight={props.calendarDayHeight ?? 52}
                    daySpacing={props.calendarRowHorizontalSpacing ?? 6}
                    isStartOfWeek={day.isStartOfWeek}
                    key={day.id}
                    theme={theme?.itemDayContainer}
                  >
                    <CalendarBase.Item.Empty
                      height={props.calendarDayHeight ?? 52}
                      theme={theme?.itemEmpty}
                    />
                  </CalendarBase.Item.Day.Container>
                )
              }
              return (
                <CalendarBase.Item.Day.Container
                  dayHeight={props.calendarDayHeight ?? 52}
                  daySpacing={4}
                  isStartOfWeek={day.isStartOfWeek}
                  key={day.id}
                  theme={theme.itemDayContainer}
                  shouldShowActiveDayFiller={
                    day.isRangeValid && !day.isEndOfRange && !day.isEndOfMonth
                  }
                >
                  <CalendarBase.Item.Day
                    height={props.calendarDayHeight ?? 52}
                    metadata={day}
                    onPress={props.onCalendarDayPress}
                    theme={theme.itemDay}
                  >
                    {day.displayLabel}
                  </CalendarBase.Item.Day>
                </CalendarBase.Item.Day.Container>
              )
            })}
          </CalendarBase.Row.Week>
        ))}
      </YStack>
    </XStack>
  )
}
