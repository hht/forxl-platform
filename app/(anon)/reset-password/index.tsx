import { Stack, useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { createWithEqualityFn } from "zustand/traditional"

import { resetPassword } from "~/api/account"
import { Button, Input, Screen, Text, YStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { popToTop } from "~/lib/utils"
import {
  LiveSupport,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"
import { PasswordValidator } from "~/widgets/shared/password-validator"

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

interface Store {
  password: string
  confirm: string
}

const INITIAL = {
  password: "",
  confirm: "",
}

export const useStore = createWithEqualityFn<Store>()((set) => INITIAL)

export default function Page() {
  const { password, confirm } = useStore()
  const { token, email } = useLocalSearchParams<{
    token: string
    email: string
  }>()
  const { t } = useTranslation("translation")
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  const scheme = useMemo(
    () =>
      z.object({
        password: z
          .string()
          .min(8, matches.length)
          .max(12, matches.length)
          .regex(/[A-Za-z]/, matches.containsLetter)
          .regex(/[!@#$%^&*_\-]/, matches.containsSpecial)
          .regex(/[0-9]/, matches.containsNumber),
        confirm: z.string().refine((v) => v === useStore.getState().password, {
          message: matches.confirm,
        }),
      }),
    [matches]
  )
  const { success, error } = scheme.safeParse({
    password,
    confirm,
  })
  const errors = error?.formErrors?.fieldErrors

  const { run, loading } = useRequest(
    () => {
      return resetPassword({ password, token, email })
    },
    {
      manual: true,
      onSuccess: () => {
        popToTop()
      },
    }
  )

  return (
    <Screen gap={32}>
      <Stack.Screen options={ScreenOptions} />
      <YStack gap={12}>
        <Text subject bold>
          {t("anon.resetPassword")}
        </Text>
        <Text col="$secondary">{t("anon.resetPasswordDesc")}</Text>
      </YStack>
      <YStack gap="$lg" f={1}>
        <Input.Password
          label={t("settings.newPassword")}
          value={password}
          status={errors?.password ? "error" : "success"}
          onChangeText={(password) => useStore.setState({ password })}
          message={errors?.password?.[0]}
        />
        <Input.Password
          label={t("anon.confirmPassword")}
          value={confirm}
          status={errors?.confirm ? "error" : "success"}
          onChangeText={(confirm) => useStore.setState({ confirm })}
          message={errors?.confirm?.[0]}
        />
        <PasswordValidator password={password} />
      </YStack>
      <Button disabled={!success} isLoading={loading} onPress={run} mb={32}>
        {t("settings.resetPassword")}
      </Button>
    </Screen>
  )
}
