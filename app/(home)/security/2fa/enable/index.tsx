import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { bindGa, getGaInfo } from "~/api/account"
import { Button, Input, ScrollView, toast, YStack } from "~/components"
import { useCountDown } from "~/hooks/useCountdown"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"
import { Steps } from "~/widgets/(home)/security/steps"

export default function Page() {
  const { t } = useTranslation("translation")
  const { countdown, setDate } = useCountDown()
  const { bottom } = useSafeAreaInsets()
  const { data } = useRequest(getGaInfo, {
    cacheKey: CACHE_KEY.GOOGLE_AUTH,
  })
  const { checkCode } = useGoogleAuthStore()
  const { run, loading } = useRequest(bindGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorEnabledSuccessfully"))
    },
    onError: (error: any) => {
      toast.show(error)
      useGoogleAuthStore.setState({ checkCode: "" })
      setDate(Date.now() + 10 * 1000)
    },
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ checkCode: "" })
  })
  return (
    <YStack f={1} pb={bottom + 16}>
      <ScrollView f={1} p="$md" showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: t("security.enableTwoFactor") }} />
        <YStack pt={32}>
          <Steps />
          <Input.OTP
            length={6}
            value={checkCode}
            disabled={loading || !!countdown}
            onChange={(checkCode) => {
              useGoogleAuthStore.setState({ checkCode })
            }}
          />
        </YStack>
      </ScrollView>
      <YStack p="$md">
        <Button
          isLoading={loading}
          disabled={loading || checkCode.length < 6 || !!countdown}
          onPress={() => {
            run({ code: checkCode, secret: data?.secret! })
          }}
        >
          {countdown
            ? t("message.retry", { time: Math.round(countdown / 1000) })
            : t("action.enable")}
        </Button>
      </YStack>
    </YStack>
  )
}
