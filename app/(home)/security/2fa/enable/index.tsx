import { router, Stack } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { bindGa, getGaInfo } from "~/api/account"
import {
  Button,
  copyToClipboard,
  Image,
  Input,
  ScrollView,
  Stepper,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"

export default function Page() {
  const { t } = useTranslation("translation")
  const { bottom } = useSafeAreaInsets()
  const { data } = useRequest(getGaInfo)
  const [value, setValue] = useState("")
  const { run, loading } = useRequest(bindGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorEnabledSuccessfully"))
    },
  })
  return (
    <YStack f={1} pb={bottom + 16}>
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
          <Input.OTP length={6} value={value} onChange={setValue} />
        </YStack>
      </ScrollView>
      <YStack p="$md">
        <Button
          isLoading={loading}
          disabled={loading || value.length < 6}
          onPress={() => {
            run({ code: value, secret: data?.secret! })
          }}
        >
          {t("security.enable")}
        </Button>
      </YStack>
    </YStack>
  )
}
