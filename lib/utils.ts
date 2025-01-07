import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import * as FileSystem from 'expo-file-system'
import { router } from 'expo-router'
import i18n from 'i18next'
import _ from 'lodash'
import { Dimensions, LayoutAnimation } from 'react-native'

import en from '~/locales/en-US/translation.json'
import zh from '~/locales/zh-CN/translation.json'

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

export type I18NResource = NestedKeyOf<(typeof resources)["en"]["translation"]>

export { i18n }

export const t = i18n.t.bind(i18n)

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

// 格式化文件大小
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + "B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + "KB"
  return (bytes / 1024 / 1024).toFixed(2) + "MB"
}

// 计算目录大小
const calculateDirSize = async (dirUri: string): Promise<number> => {
  try {
    const contents = await FileSystem.readDirectoryAsync(dirUri)
    let size = 0

    for (const item of contents) {
      const uri = `${dirUri}/${item}`
      const info = await FileSystem.getInfoAsync(uri)
      if (info.exists) {
        if (info.isDirectory) {
          size += await calculateDirSize(uri)
        } else {
          size += info.size || 0
        }
      }
    }
    return size
  } catch (error) {
    return 0
  }
}

// 获取缓存大小
export const getCacheSize = async (): Promise<string> => {
  const size = await calculateDirSize(FileSystem.cacheDirectory!)
  return formatSize(size)
}

// 清除缓存
export const clearCache = async (): Promise<void> => {
  try {
    await FileSystem.deleteAsync(FileSystem.cacheDirectory!, {
      idempotent: true,
    })
  } catch (error) {
    throw error
  }
}

export const toInfinite = <T>(data: PaginationResponse<T>, current: number) => {
  return {
    list: data.resultList ?? [],
    nextId: current + 1 > (data.pages ?? 0) ? undefined : current + 1,
  }
}

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } =
  Dimensions.get("window")
