import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { bindGa, getGaInfo } from "~/api/account"
import { Button, Input, ScrollView, toast, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"
import { Steps } from "~/widgets/(home)/security/steps"

export default function Page() {
  const { t } = useTranslation("translation")
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
            onChange={(checkCode) => {
              useGoogleAuthStore.setState({ checkCode })
            }}
          />
        </YStack>
      </ScrollView>
      <YStack p="$md">
        <Button
          isLoading={loading}
          disabled={loading || checkCode.length < 6}
          onPress={() => {
            run({ code: checkCode, secret: data?.secret! })
          }}
        >
          {t("security.enable")}
        </Button>
      </YStack>
    </YStack>
  )
}
