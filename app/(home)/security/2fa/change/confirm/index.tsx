import { useUnmount } from 'ahooks'
import { router, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { getGaInfo, updateGa } from '~/api/account'
import { Button, Input, Screen, ScrollView, toast, YStack } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useGoogleAuthStore } from '~/hooks/useStore'
import { Steps } from '~/widgets/(home)/security/steps'

export default function Page() {
  const { t } = useTranslation("translation")
  const { code, checkCode } = useGoogleAuthStore()
  const { data } = useRequest(getGaInfo, {
    cacheKey: CACHE_KEY.GOOGLE_AUTH,
  })
  const { run, loading } = useRequest(updateGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorChangedSuccessfully"))
    },
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ code: "", checkCode: "" })
  })
  return (
    <Screen p={0}>
      <ScrollView f={1} p="$md" showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: t("security.enableTwoFactor") }} />
        <YStack pt={32}>
          <Steps />
          <Input.OTP
            length={6}
            value={code}
            onChange={(code) => {
              useGoogleAuthStore.setState({ code })
            }}
          />
        </YStack>
      </ScrollView>
      <YStack p="$md">
        <Button
          isLoading={loading}
          disabled={loading || code.length < 6}
          onPress={() => {
            run({ code, secret: data?.secret!, checkCode })
          }}
        >
          {t("action.enable")}
        </Button>
      </YStack>
    </Screen>
  )
}
