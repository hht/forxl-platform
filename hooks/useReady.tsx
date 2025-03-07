import { useMount } from 'ahooks'
import { useFonts } from 'expo-font'
import * as Localization from 'expo-localization'
import * as SplashScreen from 'expo-splash-screen'
import * as Updates from 'expo-updates'
import { useCallback, useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'

import { useForxlStore } from './useStore'

import { i18n, resources } from '~/lib/utils'

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated 默认以严格模式运行
})

export const useReady = () => {
  const [ready, setReady] = useState(false)
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  })
  const checkUpdates = useCallback(async () => {
    try {
      // const update = await Updates.checkForUpdateAsync()
      // if (update.isAvailable) {
      //   await Updates.fetchUpdateAsync()
      //   await Updates.reloadAsync()
      // }
    } catch (error) {
      // console.log("Error checking updates:", error)
    }
  }, [])
  const initI18Next = useCallback(async () => {
    const locale = Localization.getLocales()[0].languageCode
    await i18n.use(initReactI18next).init({
      debug: false,
      resources: resources,
      lng: useForxlStore.getState().language ?? locale ?? "en",
      defaultNS: "translation",
      interpolation: {
        escapeValue: false,
      },
    })
  }, [])
  useMount(() => {
    Promise.all([checkUpdates(), initI18Next()]).then(() => {
      setReady(true)
      SplashScreen.hideAsync()
    })
  })
  return ready && loaded
}
