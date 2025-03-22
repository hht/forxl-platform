import { router, Stack } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { useStore } from '../auth/sign-up'

import { register } from '~/api/account'
import { Button, Input, ScrollView, Text, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { dismissAll, i18n } from '~/lib/utils'
import { LiveSupport, NativeStackNavigationOptions } from '~/widgets/shared/header'
import { PasswordValidator } from '~/widgets/shared/password-validator'

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

export default function Page() {
  const { bottom } = useSafeAreaInsets()
  const { email, inviteCode, password, confirm, verifyCode } = useStore()
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
      return register({ email, inviteCode, password, language: i18n.language, verifyCode })
    },
    {
      manual: true,
      onSuccess: () => {
        dismissAll()
        router.push(`/(anon)/auth/sign-in`)
      },
    }
  )

  return (
    <ScrollView f={1} contentContainerStyle={{ flexGrow: 1, gap: 32 }}>
      <Stack.Screen options={ScreenOptions} />
      <YStack f={1} gap={32} p="$md">
        <YStack gap={12}>
          <Text subject>{t("anon.signUp")}</Text>
          <Text col="$secondary">{t("anon.passwordDesc")}</Text>
        </YStack>
        <YStack gap="$lg" f={1}>
          <Input.Password
            label={t("anon.password")}
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
      </YStack>
      <YStack p="$md" pb={bottom + 16} bc="$background">
        <Button disabled={!success} isLoading={loading} onPress={run} mb={32}>
          {t("anon.signUp")}
        </Button>
      </YStack>
    </ScrollView>
  )
}
