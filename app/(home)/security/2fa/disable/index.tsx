import { useUnmount } from "ahooks"
import * as Clipboard from "expo-clipboard"
import { router, Stack } from "expo-router"
import { Trans, useTranslation } from "react-i18next"

import { closeGa } from "~/api/account"
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
import { useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"

export default function Page() {
  const { t } = useTranslation("translation")
  const { checkCode } = useGoogleAuthStore()
  const { run, loading } = useRequest(closeGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorDisabledSuccessfully"))
    },
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ checkCode: "" })
  })
  return (
    <Screen p="$md" pt={32} gap={24}>
      <Stack.Screen options={{ title: t("security.closeTwoFactor") }} />
      <ScrollView
        f={1}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <YStack gap="$md">
          <Text>{t("security.googleAuthCodeDesc")}</Text>
          <Input
            label={t("wallet.verificationCode")}
            value={checkCode}
            keyboardType="number-pad"
            onChangeText={(value) => {
              if (!/^\d+$/.test(value) && value !== "") {
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
          isLoading={loading}
          w="100%"
          disabled={checkCode?.length !== 6}
          onPress={() => {
            run({ code: checkCode })
          }}
        >
          {t("security.closeTwoFactor")}
        </Button>
      </YStack>
    </Screen>
  )
}
