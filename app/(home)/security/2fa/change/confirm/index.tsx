import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

import { getGaInfo, updateGa } from "~/api/account"
import {
  Button,
  copyToClipboard,
  Image,
  Input,
  Screen,
  ScrollView,
  Stepper,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"

export default function Page() {
  const { t } = useTranslation("translation")
  const { code, checkCode } = useGoogleAuthStore()
  const { data } = useRequest(getGaInfo)
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
          <Stepper>
            <Text col="$secondary">{t("security.twoFactorStepOne")}</Text>
            <YStack gap="$md">
              <Text col="$secondary">{t("security.twoFactorStepTwo")}</Text>
              <YStack ai="center" gap="$md">
                <XStack p={10} w={110} h={110} bc="white" br="$sm">
                  {data?.secret ? (
                    <Image
                      source={`data:image/png;base64,${data?.pngStr}` as any}
                      w={90}
                      h={90}
                    ></Image>
                  ) : null}
                </XStack>
                <YStack gap="$sm" ai="center">
                  <Text title ta="center">
                    {data?.secret}
                  </Text>
                  <XStack
                    hitSlop={16}
                    onPress={() => {
                      copyToClipboard(data?.secret)
                    }}
                  >
                    <Text title col="$primary">
                      {t("security.twoFactorCopy")}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>
            </YStack>
            <Text col="$secondary">{t("security.twoFactorStepThree")}</Text>
          </Stepper>
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
          {t("security.enable")}
        </Button>
      </YStack>
    </Screen>
  )
}
