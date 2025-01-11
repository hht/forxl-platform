import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { createWithEqualityFn } from "zustand/traditional"

import { sendPasswordChangeEmail } from "~/api/account"
import { Button, Input, Screen, Text, YStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { popToTop } from "~/lib/utils"
import {
  LiveSupport,
  NativeStackNavigationOptions,
} from "~/widgets/shared/header"

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

const useStore = createWithEqualityFn<{ email: string }>()((set) => ({
  email: "",
}))

export default function Page() {
  const { email } = useStore()
  const { t } = useTranslation("translation")
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  const scheme = useMemo(
    () =>
      z.object({
        email: z.string().email(matches.email),
      }),
    [matches]
  )

  const { success, error } = scheme.safeParse({
    email,
  })
  const errors = error?.formErrors?.fieldErrors

  const { run, loading } = useRequest(
    () => {
      return sendPasswordChangeEmail(email)
    },
    {
      manual: true,
      onSuccess: () => {
        popToTop()
        router.push("/(anon)/verify-email")
      },
    }
  )

  useUnmount(() => {
    useStore.setState({ email: "" })
  })
  return (
    <Screen gap={32}>
      <Stack.Screen options={ScreenOptions} />
      <YStack gap={12}>
        <Text subject bold>
          {t("anon.forgotPassword")}
        </Text>
        <Text col="$secondary">{t("anon.resetPasswordDesc")}</Text>
      </YStack>
      <YStack gap="$lg" f={1}>
        <Input
          label={t("anon.email")}
          value={email}
          status={errors?.email ? "error" : "success"}
          onChangeText={(email) => useStore.setState({ email })}
          message={errors?.email?.[0]}
        />
      </YStack>
      <Button disabled={!success} isLoading={loading} onPress={run} mb={32}>
        {t("anon.sendEmail")}
      </Button>
    </Screen>
  )
}
