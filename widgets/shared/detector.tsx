import { router, useNavigationContainerRef, useRootNavigationState } from 'expo-router'
import { useEffect } from 'react'

import { validateInviteCode } from '~/api/account'
import { useStore } from '~/app/(anon)/auth/sign-up'
import { useLocaleCalendar } from '~/hooks/useLocale'
import { useForxlStore } from '~/hooks/useStore'
import { dismissAll } from '~/lib/utils'

const validateCode = async (code: string) => {
  if (!code || !/^[A-Za-z0-9]{8}$/.test(code)) {
    return false
  }
  try {
    const validated = await validateInviteCode(code)
    if (validated) {
      useStore.setState({
        validated,
        inviteCode: code,
      })
      return true
    } else {
      useStore.setState({
        validated: false,
        inviteCode: '',
      })
      return false
    }
  } catch (error) {
    return false
  }
}

export const AccountDetector = () => {
  const userNumber = useForxlStore((state) => state.userNumber)
  const rootNavigation = useNavigationContainerRef()
  const navigationState = useRootNavigationState()
  useEffect(() => {
    if (!navigationState?.key || !rootNavigation.current) return
    requestAnimationFrame(async () => {
      const currentRoute = rootNavigation.current?.getCurrentRoute()
      if (!currentRoute) return
      if (currentRoute.name === 'index' && currentRoute.params) {
        const params = currentRoute.params as any
        if (params?.code) {
          const validated = await validateCode((params).code as string)
          if (validated) {
            router.replace("/auth/sign-up")
          }
        }
      }
      if (userNumber && (currentRoute?.name === 'index' || currentRoute?.name.startsWith('auth'))) {
        dismissAll()
        router.replace("/tabs/dashboard")
        return
      }
      if (!userNumber && !["index", 'auth/sign-in/index', 'auth/sign-up/index', 'create-password/index', 'forgot-password/index', 'reset-password/index', 'verify-email/index'].includes(currentRoute?.name ?? '')) {
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
