import { useUnmount } from 'ahooks'
import { router, Stack } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'
import { createWithEqualityFn } from 'zustand/traditional'

import { changePassword } from '~/api/account'
import { Button, Input, ScrollView, Text, toast, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useForxlStore } from '~/hooks/useStore'
import { dismissAll } from '~/lib/utils'
import { LiveSupport, NativeStackNavigationOptions } from '~/widgets/shared/header'
import { PasswordValidator } from '~/widgets/shared/password-validator'

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

interface Store {
  previous: string
  password: string
  confirm: string
}

const INITIAL = {
  previous: "",
  password: "",
  confirm: "",
}

export const useStore = createWithEqualityFn<Store>()((set) => INITIAL)

export default function Page() {
  const { password, confirm, previous } = useStore()
  const { bottom } = useSafeAreaInsets()
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

  const { run, loading } = useRequest(changePassword, {
    manual: true,
    onSuccess: () => {
      toast.show(t("settings.passwordChangedSuccessful"))
      dismissAll()
      router.replace("/(anon)/auth/sign-in")
      useForxlStore.setState({ userNumber: undefined })
    },
  })
  useUnmount(() => {
    useStore.setState(INITIAL)
  })
  return (
    <YStack f={1}>
      <Stack.Screen options={ScreenOptions} />
      <ScrollView f={1}>
        <YStack gap={24} p="$md">
          <YStack gap={12}>
            <Text subject bold>
              {t("anon.resetPassword")}
            </Text>
            <Text col="$secondary">{t("anon.resetPasswordDescription")}</Text>
          </YStack>
          <YStack gap="$lg" f={1}>
            <Input.Password
              label={t("settings.currentPassword")}
              value={previous}
              disableValidation
              onChangeText={(previous) => useStore.setState({ previous })}
            />
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
        </YStack>
      </ScrollView>
      <YStack p="$md">
        <Button
          disabled={!success}
          isLoading={loading}
          onPress={() => {
            if (password === useStore.getState().previous) {
              toast.show(t("message.samePassword"))
              return
            }
            run({
              password,
              previous: useStore.getState().previous,
            })
          }}
        >
          {t("settings.resetPassword")}
        </Button>
      </YStack>
      <YStack h={bottom} />
    </YStack>
  )
}
