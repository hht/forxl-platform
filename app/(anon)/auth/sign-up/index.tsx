import { useDebounceFn, useUnmount } from 'ahooks'
import { router, Stack } from 'expo-router'
import { round } from 'lodash'
import { FC, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { z } from 'zod'
import { createWithEqualityFn } from 'zustand/traditional'

import { sendRegisterCode, validateInviteCode } from '~/api/account'
import { Button, Input, ScrollView, Text, toast, XStack, YStack } from '~/components'
import { useCountDown } from '~/hooks/useCountdown'
import { useRequest } from '~/hooks/useRequest'
import { APP_URL } from '~/lib/constants'
import { i18n, t } from '~/lib/utils'
import { LiveSupport, NativeStackNavigationOptions } from '~/widgets/shared/header'
import { WebLink } from '~/widgets/shared/link'

const ScreenOptions: NativeStackNavigationOptions = {
  title: "",
  headerRight: () => <LiveSupport />,
}

interface Store {
  email: string
  password: string
  confirm: string
  inviteCode: string
  validated?: boolean
  verifyCode: string
}

const INITIAL = {
  email: "",
  password: "",
  confirm: "",
  inviteCode: "",
  verifyCode: ""
}

export const useStore = createWithEqualityFn<Store>()((set) => INITIAL)


const GetCodeButton: FC<{
  email?: string
  disabled: boolean
}> = ({ email, disabled }) => {
  const { countdown, setDate } = useCountDown()
  const { run: getCode, loading: sending } = useRequest(sendRegisterCode, {
    manual: true,
    onSuccess: (__, [{ }]) => {
      setDate(Date.now() + 60 * 1000)
      toast.show(
        t("settings.emailVerificationCodeDesc", {
          email,
        })
      )
    },
    onError: (error) => {
      setDate(Date.now() + 60 * 1000)
    }
  })
  return countdown !== 0 ? (
    <XStack h="100%" px="$md" ai="center" jc="center">
      <Text col="$primary">{round(countdown / 1000)}</Text>
    </XStack>
  ) : (
    <Button
      h="100%"
      px="$md"
      isLoading={sending}
      type="link"
      disabled={disabled || sending || !email}
      onPress={() => {
        getCode(email!)
      }}
    >
      {t("settings.getVerificationCode")}
    </Button>
  )
}

export default function Page() {
  const { email, inviteCode, validated, verifyCode } = useStore()
  const { t } = useTranslation("translation")
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  const scheme = useMemo(
    () =>
      z.object({
        email: z.string().email(matches.email),
        verifyCode: z.string().regex(/^\d{6}$/, matches.code),
        inviteCode: z.string().regex(/^[A-Za-z0-9]{8}$/, matches.inviteCode),
      }),
    [matches]
  )

  const { run: validateCode } = useDebounceFn(
    async (code?: string) => {
      if (!code || !/^[A-Za-z0-9]{8}$/.test(code)) {
        return
      }
      try {
        const validated = await validateInviteCode(code)
        useStore.setState({ validated })
      } catch (error) {
        useStore.setState({ validated: false })
      }
    },
    { wait: 500 }
  )

  const { success, error } = scheme.safeParse({
    email,
    inviteCode,
    verifyCode
  })
  const errors = error?.formErrors?.fieldErrors

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
          {t("anon.signUp")}
        </Text>
        <Text col="$secondary">{t("anon.welcomeDesc")}</Text>
      </YStack>
      <YStack gap="$md" f={1}>
        <Input
          label={t("anon.email")}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          status={errors?.email ? "error" : "success"}
          onChangeText={(email) => useStore.setState({ email })}
          message={errors?.email?.[0]}
        />
        <Input
          label={t("anon.code")}
          value={verifyCode}
          autoCapitalize="none"
          status={errors?.verifyCode ? "error" : "success"}
          onChangeText={(verifyCode) => {
            if ((verifyCode.length) <= 6) {
              useStore.setState({ verifyCode })
            }
          }}
          message={errors?.verifyCode?.[0]}
          addonAfter={<GetCodeButton email={email} disabled={!!errors?.email} />}
        />
        <Input
          label={t("anon.inviteCode")}
          value={inviteCode}
          status={((!!errors?.inviteCode) || !validated) ? "error" : "success"}
          onChangeText={(inviteCode) => {
            useStore.setState({ inviteCode })
            validateCode(inviteCode)
          }}
          message={errors?.inviteCode?.[0] ?? (validated ? undefined : t("anon.matches.inviteCode"))}
        />
      </YStack>
      <YStack gap="$md" ai="center" pb={32}>
        <Text caption col="$secondary" ai="baseline">
          <Trans
            i18nKey="anon.terms"
            components={{
              1: (
                <WebLink
                  href={`${APP_URL}/help/documents/terms-and-conditions?language=${i18n.language}`}
                  col="$primary"
                  fos={11}
                  lh={14}
                  textDecorationLine="underline"
                />
              ),
              2: (
                <WebLink
                  href={`${APP_URL}/help/documents/privacy-policy?language=${i18n.language}`}
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
          disabled={!success || !validated}
          onPress={() => {
            router.push("/(anon)/create-password")
          }}
        >
          {t("anon.next")}
        </Button>
      </YStack>
    </ScrollView>
  )
}
