import { router, useNavigationContainerRef, useRootNavigationState } from 'expo-router'
import { useEffect } from 'react'

import { useLocaleCalendar } from '~/hooks/useLocale'
import { useForxlStore } from '~/hooks/useStore'
import { dismissAll } from '~/lib/utils'

export const AccountDetector = () => {
  const userNumber = useForxlStore((state) => state.userNumber)
  const rootNavigation = useNavigationContainerRef()
  const navigationState = useRootNavigationState()
  useEffect(() => {
    if (!navigationState?.key || !rootNavigation.current) return
    requestAnimationFrame(() => {
      if (userNumber && (rootNavigation.current?.getCurrentRoute()?.name === 'index' || rootNavigation.current?.getCurrentRoute()?.name.startsWith('auth'))) {
        dismissAll()
        router.replace("/tabs/dashboard")
        return
      }
      if (!userNumber && !["index", 'auth/sign-in/index'].includes(rootNavigation.current?.getCurrentRoute()?.name ?? '')) {
        dismissAll()
        router.replace("/")
      }
    })
  }, [userNumber, rootNavigation, navigationState?.key])
  return null
}
export const LocaleDetector = () => {
  useLocaleCalendar()
  return null
}
