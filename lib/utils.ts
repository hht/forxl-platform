import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/zh"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import localeData from "dayjs/plugin/localeData"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import * as Localization from "expo-localization"
import { router } from "expo-router"
import i18n from "i18next"
import _ from "lodash"
import { initReactI18next } from "react-i18next"
import { LayoutAnimation } from "react-native"

import en from "~/locales/en-US/translation.json"
import zh from "~/locales/zh-CN/translation.json"

dayjs.extend(localeData)
dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

export { dayjs }

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
} as const

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type I18NResource = NestedKeyOf<(typeof resources)["en"]>

i18n.use(initReactI18next).init({
  debug: false,
  resources,
  lng: "en",
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }

export const t = i18n.t.bind(i18n)

export const initI18Next = async () => {
  const locale = Localization.getLocales()[0].languageCode
  i18n.use(initReactI18next).init({
    debug: false,
    resources,
    lng: locale ?? "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  })
}

export const animateOnNextFrame = () => {
  LayoutAnimation.configureNext({
    duration: 300,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  })
}

export const getLocaleLanguage = (locale: string) => {
  switch (locale) {
    case "zh":
      return "zh-hans"
    case "zh-TW":
      return "zh-hant"
    default:
      return locale
  }
}

export const waitFor = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const formatDecimal = (value: string | number, fraction = 0.01) => {
  const precision = fraction.toString().split(".")[1]?.length ?? 0
  return new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(_.isNaN(Number(value)) ? 0 : Number(value))
}

export const popToTop = () => {
  while (router.canGoBack()) {
    router.back()
  }
}
