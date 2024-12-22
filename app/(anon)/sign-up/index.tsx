import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"
import { createWithEqualityFn } from "zustand/traditional"

import { Button, Input, Screen, Text, YStack } from "~/components"
import { LiveSupport, NativeStackNavigationOptions } from "~/widgets/header"
import { WebLink } from "~/widgets/link"

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
  email: "froxl-test@snapmail.cc",
  password: "",
  confirm: "",
  inviteCode: "LY869960",
}

export const useStore = createWithEqualityFn<Store>()((set) => INITIAL)

export default function Page() {
  const { email, inviteCode } = useStore()
  const { t } = useTranslation("translation")
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  const scheme = useMemo(
    () =>
      z.object({
        email: z.string().email(matches.email),
        inviteCode: z.string().min(6, matches.inviteCode),
      }),
    [matches]
  )

  const { success, error } = scheme.safeParse({
    email,
    inviteCode,
  })
  const errors = error?.formErrors?.fieldErrors

  useUnmount(() => {
    useStore.setState(INITIAL)
  })
  return (
    <Screen gap={32}>
      <Stack.Screen options={ScreenOptions} />
      <YStack gap={12}>
        <Text subject>{t("anon.signUp")}</Text>
        <Text col="$secondary">{t("anon.welcomeDesc")}</Text>
      </YStack>
      <YStack gap="$md" f={1}>
        <Input
          label={t("anon.email")}
          value={email}
          status={errors?.email ? "error" : "success"}
          onChangeText={(email) => useStore.setState({ email })}
          message={errors?.email?.[0]}
        />
        <Input
          label={t("anon.inviteCode")}
          value={inviteCode}
          status={errors?.inviteCode ? "error" : "success"}
          onChangeText={(inviteCode) => useStore.setState({ inviteCode })}
          message={errors?.inviteCode?.[0]}
        />
      </YStack>
      <YStack gap="$md" ai="center" pb={32}>
        <Text caption col="$secondary" lh={14} ai="baseline">
          <Trans
            i18nKey="anon.terms"
            components={{
              1: (
                <WebLink
                  href="http://www.google.com"
                  col="$primary"
                  fos={11}
                  lh={14}
                  textDecorationLine="underline"
                />
              ),
              2: (
                <WebLink
                  href="http://www.baidu.com"
                  col="$primary"
                  fos={11}
                  lh={14}
                  textDecorationLine="underline"
                />
              ),
            }}
          ></Trans>
        </Text>
        <Button
          w="100%"
          disabled={!success}
          onPress={() => {
            router.push("/(anon)/create-password")
          }}
        >
          {t("anon.next")}
        </Button>
      </YStack>
    </Screen>
  )
}
