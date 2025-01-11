import { useUnmount } from "ahooks"
import * as Clipboard from "expo-clipboard"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

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
  const { code } = useGoogleAuthStore()
  const { run, loading } = useRequest(closeGa, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("security.twoFactorDisabledSuccessfully"))
    },
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ code: "" })
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
          <Text>{t("security.closeTwoFactor")}</Text>
          <Input
            label={t("wallet.verificationCode")}
            value={code}
            keyboardType="number-pad"
            onChangeText={(value) => {
              if (!/^\d+$/.test(value) && value !== "") {
                return
              }
              useGoogleAuthStore.setState({ code: value })
            }}
            addonAfter={
              <XStack
                hitSlop={16}
                onPress={() => {
                  Clipboard.getStringAsync().then((value) => {
                    if (!/^\d+$/.test(value)) {
                      return
                    }
                    useGoogleAuthStore.setState({ code: value })
                  })
                }}
              >
                <Text col="$primary">{t("action.paste")}</Text>
              </XStack>
            }
          />
        </YStack>
      </ScrollView>
      <Button
        isLoading={loading}
        disabled={code?.length !== 6}
        onPress={() => {
          run({ code })
        }}
      >
        {t("security.closeTwoFactor")}
      </Button>
    </Screen>
  )
}
