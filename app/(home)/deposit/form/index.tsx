import { useUnmount } from 'ahooks'
import * as Linking from 'expo-linking'
import { router, Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { deposit } from '~/api/wallet'
import { Button, ScrollView, YStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { DepositResult, useWalletStore } from '~/hooks/useStore'
import { DepositSteps } from '~/widgets/(home)/deposit/confirm/steps'
import { DepositForm } from '~/widgets/(home)/deposit/form/form'
import { AccountCard } from '~/widgets/shared/account-card'

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const windowRef = useRef<Window | null>(null)
  const {
    depositMethod: method,
    depositRequest,
    depositResult,
  } = useWalletStore()
  const { run, loading } = useRequest(deposit, {
    manual: true,
    onSuccess: (data) => {
      useWalletStore.setState({
        depositResult: data as DepositResult,
      })
      if (data) {
        if (data.payType === 3) {
          router.push("/deposit/confirm")
          return
        }
        if (data.payType === 101) {
          if (Platform.OS === 'web' && windowRef.current) {
            windowRef.current.window.location.href = data.order_data as string
          } else {
            Linking.openURL(data.order_data as string)
          }
          router.back()
        }
      }
    },
  })
  useEffect(() => {
    if (method?.payType === 0 || method?.payType === 1) {
      const depositMethod = useWalletStore.getState().depositMethod!
      run({
        code: depositMethod?.code!,
        amount:
          ((depositMethod.incomeMoneyMin ?? 0) +
            (depositMethod.incomeMoneyMax ?? 0)) /
          2,
        type: depositMethod?.payType ?? 0,
        paymentId: depositMethod?.id,
      })
    }
  }, [method?.payType, run])
  useUnmount(() => {
    useWalletStore.getState().clean()
  })
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.deposit") }} />
      <YStack p="$md" gap={20} pb={bottom + 16}>
        <AccountCard />
        <DepositForm />
        {method?.payType !== 3 && depositResult && !loading ? (
          <DepositSteps />
        ) : null}
        {method?.payType === 3 ? (
          <Button
            isLoading={loading}
            disabled={
              loading ||
              parseFloat(depositRequest.amount ?? '0') <
              (method?.incomeMoneyMin ?? -Infinity) ||
              parseFloat(depositRequest.amount ?? '0') >
              (method?.incomeMoneyMax ?? Infinity) ||
              (method?.payType === 3 &&
                (!depositRequest.payBank ||
                  !depositRequest.payName ||
                  !depositRequest.payAccount))
            }
            onPress={() => {
              run({
                code: method?.code!,
                amount: parseFloat(depositRequest.amount ?? '0'),
                type: method?.payType ?? 0,
                paymentId: method?.id,
                userPayAccount: depositRequest.payAccount,
                userPayBank: depositRequest.payBank,
                userPayName: depositRequest.payName,
                payApiUrl: method?.payApiUrl,
              })
            }}
          >
            {t("wallet.deposit")}
          </Button>
        ) : method?.payType === 101 ? (
          <Button
            isLoading={loading}
            disabled={
              loading ||
              parseFloat(depositRequest.amount ?? '0') <
              (method?.incomeMoneyMin ?? -Infinity) ||
              parseFloat(depositRequest.amount ?? '0') >
              (method?.incomeMoneyMax ?? Infinity)
            }
            onPress={() => {
              if (Platform.OS === 'web') {
                windowRef.current = window.open(
                  'about:blank',
                  '_blank'
                )
              }
              run({
                code: method?.code!,
                amount: parseFloat(depositRequest.amount ?? '0'),
                type: method?.payType ?? 0,
                paymentId: method?.id,
                userPayAccount: depositRequest.payAccount,
                userPayBank: depositRequest.payBank,
                userPayName: depositRequest.payName,
                payChannel: method.payChannel,
                currency: method.currency,
                payApiUrl: method?.payApiUrl,
              })
            }}
          >
            {t("wallet.deposit")}
          </Button>
        ) : (
          <Button
            f={1}
            onPress={() => {
              router.back()
            }}
          >
            {t("action.done")}
          </Button>
        )}
      </YStack>
    </ScrollView>
  )
}
