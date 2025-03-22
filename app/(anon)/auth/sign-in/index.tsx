import { useUnmount } from 'ahooks'
import { Link, router, Stack } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { createWithEqualityFn } from 'zustand/traditional'

import { getProfile, signIn } from '~/api/account'
import { Button, Input, ScrollView, Text, XStack, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useForxlStore } from '~/hooks/useStore'
import { LiveSupport, NativeStackNavigationOptions } from '~/widgets/shared/header'

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

interface Store {
  email: string
  password: string
  confirm: string
  inviteCode: string
}

const INITIAL = {
  email: "",
  password: "",
  confirm: "",
  inviteCode: "",
}

const useStore = createWithEqualityFn<Store>()((set) => INITIAL)

export default function Page() {
  const { email, password } = useStore()
  const { t } = useTranslation("translation")
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  const scheme = useMemo(
    () =>
      z.object({
        email: z.string().email(matches.email),
        password: z.string()
          .min(8, matches.length)
          .max(12, matches.length)
          .regex(/[A-Za-z]/, matches.containsLetter)
          .regex(/[0-9]/, matches.containsNumber),
      }),
    [matches]
  )

  const { success, error } = scheme.safeParse({
    email,
    password,
  })
  const errors = error?.formErrors?.fieldErrors

  const { run, loading } = useRequest(() => signIn({ email, password }), {
    manual: true,
    onSuccess: async ({ user, userNumber, code }) => {
      if (code === 1502) {
        router.push(`/verify-email?email=${email}`)
        return
      }
      useForxlStore.setState({ userNumber, account: user })
      await getProfile()
    }
  })

  useUnmount(() => {
    useStore.setState(INITIAL)
  })
  return (
    <ScrollView
      f={1}
      contentContainerStyle={{ flexGrow: 1, gap: 32, padding: 16 }}
    >
      <Stack.Screen options={ScreenOptions} />
      <YStack gap={12}>
        <Text subject bold>
          {t("anon.welcome")}
        </Text>
        <Text col="$secondary">{t("anon.welcomeDesc")}</Text>
      </YStack>
      <YStack gap="$md" f={1}>
        <Input
          label={t("anon.email")}
          value={email}
          keyboardType="email-address"
          autoCapitalize='none'
          status={errors?.email ? "error" : "success"}
          onChangeText={(email) => useStore.setState({ email })}
          message={errors?.email?.[0]}
        />
        <Input.Password
          label={t("anon.password")}
          value={password}
          status={errors?.password ? "error" : "success"}
          onChangeText={(password) => useStore.setState({ password })}
          message={errors?.password?.[0]}
        />
      </YStack>
      <Button disabled={!success} isLoading={loading} onPress={run}>
        {t("action.login")}
      </Button>
      <YStack gap="$md" ai="center" pb={32}>
        <Link href="/(anon)/forgot-password" asChild>
          <Text col="$primary" bold textDecorationLine="underline">
            {t("anon.forgotPassword")}
          </Text>
        </Link>
        <XStack ai="center" gap={2}>
          <Text col="$secondary" bold>
            {t("anon.noAccount")}
          </Text>
          <Link href="/(anon)/auth/sign-up" replace asChild>
            <Text col="$primary" bold textDecorationLine="underline">
              {t("anon.signUp")}
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
