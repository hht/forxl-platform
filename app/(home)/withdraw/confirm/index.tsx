import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import { withdraw } from "~/api/wallet"
import { Button, Input, Text, toast, YStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useFroxlStore, useWalletStore } from "~/hooks/useStore"
import { InputSuffix } from "~/widgets/shared/input-suffix"

export default function Page() {
  const { t } = useTranslation()
  const email = useFroxlStore((state) => state.account?.email, shallow)
  const { withdrawRequest } = useWalletStore()
  const { bottom } = useSafeAreaInsets()
  const { run, loading } = useRequest(withdraw, {
    manual: true,
    onSuccess: () => {
      router.back()
      toast.show(t("wallet.withdrawSuccessful"))
    },
  })

  return (
    <YStack f={1} p="$md" gap={24} pb={bottom + 16}>
      <Stack.Screen options={{ title: t("wallet.securityVerification") }} />
      <YStack gap={12}>
        <Text>
          {t("wallet.emailVerificationCodeDesc", {
            email: email
              ?.split("@")
              .map((n, i) => (i === 0 ? n.replace(/(?<=^.{1})./g, "*") : n))
              .join("@"),
          })}
        </Text>
        <Input
          label={t("wallet.verificationCode")}
          value={""}
          disableValidation
          onChange={(verificationCode) => {}}
          addonAfter={
            <InputSuffix col="$primary" onPress={() => {}}>
              {t("settings.getVerificationCode")}
            </InputSuffix>
          }
        ></Input>
      </YStack>
      <YStack f={1} gap={12}>
        <Text>{t("security.googleAuthCodeDesc")}</Text>
        <Input
          label={t("wallet.verificationCode")}
          value={""}
          disableValidation
          onChange={(googleAuthCode) => {}}
          addonAfter={
            <InputSuffix col="$primary">{t("action.paste")}</InputSuffix>
          }
        ></Input>
      </YStack>
      <Button disabled={loading} onPress={() => {}}>
        {t("wallet.confirmWithdraw")}
      </Button>
    </YStack>
  )
}
