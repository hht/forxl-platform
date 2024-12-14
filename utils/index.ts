import * as Localization from "expo-localization"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "~/locales/en-US/translation.json"
import zh from "~/locales/zh-CN/translation.json"

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
