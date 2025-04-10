import SumSubWebSdk from '@sumsub/websdk-react'
import { router, Stack } from 'expo-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { getProfile, getSumSubToken } from '~/api/account'
import { toast, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { i18n, waitFor } from '~/lib/utils'

export default function Page() {
  const { t } = useTranslation()
  const { data } = useRequest(getSumSubToken)

  return (
    <Fragment>
      <Stack.Screen options={{ title: t("profile.identityVerification") }} />
      {data ? (
        <SumSubWebSdk
          expirationHandler={async () => {
            return "expired"
          }}
          accessToken={data}
          config={{ lang: i18n.resolvedLanguage }}
          options={{ addViewportTag: false, adaptIframeHeight: true }}
          onMessage={async (type: string, payload: any) => {
            if (type === "idCheck.onApplicantStatusChanged") {
              await waitFor(1000)
              getProfile()
              router.back()
            }
          }}
          onError={(error: Error) => {
            toast.show(error.message)
          }}
        />
      ) : (
        <YStack f={1} ai="center" jc="center">
          <Stack.Screen
            options={{ title: t("profile.identityVerification") }}
          />
        </YStack>
      )}
    </Fragment>
  )
}
