import { useUnmount } from "ahooks"
import * as Clipboard from "expo-clipboard"
import { router, Stack } from "expo-router"
import { Trans, useTranslation } from "react-i18next"

import { getGaInfo, updateGa } from "~/api/account"
import {
  Button,
  Input,
  Screen,
  ScrollView,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useCountDown } from "~/hooks/useCountdown"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"
import { Steps } from "~/widgets/(home)/security/steps"

export default function Page() {
  const { t } = useTranslation("translation")
  const { code, checkCode } = useGoogleAuthStore()
  const { countdown, setDate } = useCountDown()
  const { data } = useRequest(getGaInfo, {
    cacheKey: CACHE_KEY.GOOGLE_AUTH,
  })
  const { run, loading } = useRequest(updateGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorChangedSuccessfully"))
    },
    onFinally: () => {
      setDate(Date.now() + 10 * 1000)
    },
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ code: "", checkCode: "" })
  })
  return (
    <Screen p="$md" pt={32} gap={24}>
      <Stack.Screen options={{ title: t("security.changeTwoFactor") }} />
      <ScrollView
        f={1}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <Steps>
          <YStack gap="$md">
            <Text col="$secondary">
              {t("security.twoFactorStepAdditional")}
            </Text>
            <Input
              label={t("wallet.verificationCode")}
              value={checkCode}
              keyboardType="number-pad"
              onChangeText={(value) => {
                if (!/^\d+$/.test(value) && value !== "") {
                  return
                }
                if (value.length > 6) {
                  return
                }
                useGoogleAuthStore.setState({ checkCode: value })
              }}
              addonAfter={
                <XStack
                  hitSlop={16}
                  onPress={() => {
                    Clipboard.getStringAsync().then((value) => {
                      if (!/^\d+$/.test(value)) {
                        return
                      }
                      useGoogleAuthStore.setState({ checkCode: value })
                    })
                  }}
                >
                  <Text col="$primary">{t("action.paste")}</Text>
                </XStack>
              }
            />
          </YStack>
        </Steps>
        <Input.OTP
          length={6}
          value={code}
          onChange={(code) => {
            useGoogleAuthStore.setState({ code })
          }}
        />
      </ScrollView>
      <YStack gap={24} py="$md" ai="center">
        <Text col="$secondary" bold ai="center">
          <Trans
            i18nKey="security.unavailable"
            components={{
              1: <Text col="$primary" bold />,
            }}
          />
        </Text>
        <Button
          w="100%"
          isLoading={loading}
          disabled={
            checkCode?.length !== 6 ||
            code.length !== 6 ||
            loading ||
            !!countdown
          }
          onPress={() => {
            run({ code, secret: data?.secret!, checkCode })
          }}
        >
          {countdown
            ? t("message.retry", { time: Math.round(countdown / 1000) })
            : t("action.enable")}
        </Button>
      </YStack>
    </Screen>
  )
}
