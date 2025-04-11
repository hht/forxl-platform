import dayjs from 'dayjs'
import * as Clipboard from 'expo-clipboard'
import { router, Stack } from 'expo-router'
import { round } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'
import { shallow } from 'zustand/shallow'

import { sendEmailCode, withdraw } from '~/api/wallet'
import { Button, Input, ScrollView, Text, toast, YStack } from '~/components'
import { useCountDown } from '~/hooks/useCountdown'
import { useRequest } from '~/hooks/useRequest'
import { useForxlStore, useWalletStore } from '~/hooks/useStore'
import { InputSuffix } from '~/widgets/shared/input-suffix'

export default function Page() {
  const { t } = useTranslation()
  const email = useForxlStore((state) => state.account?.email, shallow)
  const { countdown, setDate } = useCountDown()
  const { withdrawRequest, withdrawMethod } = useWalletStore()
  const { bottom } = useSafeAreaInsets()

  const scheme = useMemo(
    () =>
      z.object({
        gaCode: z
          .string()
          .regex(/^\d{6}$/, t("message.verificationCodePrompt"))
          .length(6, t("message.verificationCodePrompt")).optional(),

        emailCode: z
          .string()
          .regex(/^\d{6}$/, t("message.verificationCodePrompt"))
          .length(6, t("message.verificationCodePrompt")),
      }),
    [t]
  )

  const { success, error } = scheme.safeParse({
    gaCode: withdrawRequest.gaCode,
    emailCode: withdrawRequest.emailCode,
  })
  const errors = error?.formErrors?.fieldErrors
  const { run, loading } = useRequest(withdraw, {
    manual: true,
    onSuccess: () => {
      router.back()
      useWalletStore.getState().clean()
      toast.show(t("wallet.withdrawSuccessful"))
    },
  })

  return (
    <ScrollView f={1} p="$md" gap={24} pb={bottom + 16} contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ title: t("wallet.securityVerification") }} />
      <YStack gap={12}>
        <Text>
          {t("wallet.emailVerificationCodeDesc", {
            email: email
              ?.split("@")
              .map((n, i) => (i === 0 ? n.charAt(0) + n.slice(1).replace(/./g, "*") : n))
              .join("@"),
          })}
        </Text>
        <Input
          label={t("wallet.verificationCode")}
          value={withdrawRequest.emailCode}
          message={errors?.emailCode?.[0]}
          onChangeText={(emailCode) => {
            if (/^[0-9]{0,6}$/.test(emailCode ?? "")) {
              useWalletStore.setState({
                withdrawRequest: { ...withdrawRequest, emailCode },
              })
            }
          }}
          addonAfter={
            <InputSuffix
              col="$primary"
              disabled={!!countdown}
              onPress={() => {
                sendEmailCode().finally(() => {
                  setDate(Date.now() + 60 * 1000)
                })
              }}
            >
              {countdown ? t("message.countdown", {
                time: round(countdown / 1000)
              }) : t("settings.getVerificationCode")}
            </InputSuffix>
          }
        ></Input>
      </YStack>
      {withdrawMethod?.gaAuth ? <YStack f={1} gap={12}>
        <Text>{t("security.googleAuthCodeDesc")}</Text>
        <Input
          label={t("wallet.verificationCode")}
          value={withdrawRequest.gaCode}
          message={errors?.gaCode?.[0]}
          onChangeText={(gaCode) => {
            if (/^[0-9]{0,6}$/.test(gaCode ?? "")) {
              useWalletStore.setState({
                withdrawRequest: { ...withdrawRequest, gaCode },
              })
            }
          }}
          addonAfter={
            <InputSuffix
              col="$primary"
              onPress={() => {
                Clipboard.getStringAsync().then((gaCode) => {
                  useWalletStore.setState({
                    withdrawRequest: { ...withdrawRequest, gaCode },
                  })
                })
              }}
            >
              {t("action.paste")}
            </InputSuffix>
          }
        ></Input>
      </YStack> : null}
      <Button
        disabled={loading || !success}
        onPress={() => {
          run({
            wdAccount: withdrawRequest?.wdAccount!,
            emailCode: withdrawRequest?.emailCode!,
            gaCode: withdrawMethod?.gaAuth ? withdrawRequest?.gaCode : undefined,
            money: withdrawRequest?.money!,
            recordType: withdrawMethod?.channelType!,
            channelCode: withdrawMethod?.channelCode!,
            spId: `${withdrawMethod?.id}`,
            timestamp: dayjs().unix(),
          })
        }}
      >
        {t("wallet.confirmWithdraw")}
      </Button>
    </ScrollView>
  )
}
