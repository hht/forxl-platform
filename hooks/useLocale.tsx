import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useFroxlStore } from './useStore'

import { dayjs, i18n, t } from '~/lib/utils'

export const getDate = (date?: dayjs.ConfigType) => {
  return dayjs(date).utcOffset(useFroxlStore.getState().timezone)
}

const formatDateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}

export const formatDate = (
  date: string | number,
  options = formatDateOptions
) => {
  return new Intl.DateTimeFormat(i18n.language, {
    ...formatDateOptions,
    ...options,
  }).format(getDate(date).unix() * 1000)
}

export const getRecentDate = (date?: number) => {
  const dayjsDate = getDate(date)
  if (dayjsDate.isToday()) {
    return t("notifications.today")
  } else if (dayjsDate.isYesterday()) {
    return t("notifications.yesterday")
  } else {
    return dayjsDate.format("YYYY-MM-DD")
  }
}

export const useLocale = () => {
  const { i18n } = useTranslation()
  useEffect(() => {
    dayjs.locale(i18n.language)
    useFroxlStore.setState({ language: i18n.resolvedLanguage ?? i18n.language })
  }, [i18n.resolvedLanguage, i18n.language])
}
