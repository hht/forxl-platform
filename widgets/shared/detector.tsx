import {
  router,
  useNavigationContainerRef,
  useRootNavigationState,
} from "expo-router"
import { useEffect } from "react"

import { useLocaleCalendar } from "~/hooks/useLocale"
import { useFroxlStore } from "~/hooks/useStore"
import { popToTop } from "~/lib/utils"

export const AccountDetector = () => {
  const userNumber = useFroxlStore((state) => state.userNumber)
  const rootNavigation = useNavigationContainerRef()
  const navigationState = useRootNavigationState()
  useEffect(() => {
    if (!navigationState?.key || !rootNavigation.current) return
    requestAnimationFrame(() => {
      if (userNumber) {
        popToTop()
        router.replace("/tabs/dashboard")
      } else {
        popToTop()
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
