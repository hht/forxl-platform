import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getAssets } from "~/api/wallet"
import { Button, Input, ScrollView, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useWalletStore } from "~/hooks/useStore"
import { WithdrawSummary } from "~/widgets/(home)/withdraw/form/summary"
import { WithdrawMethod } from "~/widgets/(home)/withdraw/form/withdraw-method"
import { AccountCard } from "~/widgets/shared/account-card"
import { AttentionCard } from "~/widgets/shared/attention-card"
import { InputSuffix } from "~/widgets/shared/input-suffix"

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { withdrawMethod: method, withdrawRequest } = useWalletStore()

  const { data: assets } = useRequest(getAssets, {
    cacheKey: CACHE_KEY.ASSETS,
  })
  useUnmount(() => {
    useWalletStore.getState().clean()
  })
  if (!method) {
    return null
  }
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.withdrawal") }} />
      <YStack p="$md" gap={20} pb={bottom + 16}>
        <AccountCard />
        <AttentionCard>{t("wallet.withdrawPrompt")}</AttentionCard>
        <WithdrawMethod />
        <Input
          label={t("wallet.walletAddress")}
          value={withdrawRequest.address}
          disableValidation
          onChangeText={(address) =>
            useWalletStore.setState({
              withdrawRequest: { ...withdrawRequest, address },
            })
          }
        />
        <Input.Decimal
          label={t("wallet.withdrawAmount")}
          value={withdrawRequest.amount}
          max={parseFloat(
            assets?.userWalletDetail.fundsAccount.available ?? "0"
          )}
          disableValidation
          addonAfter={<InputSuffix>USDT</InputSuffix>}
          onChange={(amount) => {
            useWalletStore.setState({
              withdrawRequest: { ...withdrawRequest, amount },
            })
          }}
        />
        <WithdrawSummary />
        <Button
          disabled={
            !new RegExp(method.validationRegex).test(withdrawRequest.address) ||
            (withdrawRequest.amount ?? 0) <
              parseFloat(method?.minAmount ?? "-Infinity") ||
            (withdrawRequest.amount ?? 0) >
              parseFloat(method?.maxAmount ?? "Infinity") ||
            !withdrawRequest.address
          }
          onPress={() => {
            router.push("/withdraw/confirm")
          }}
        >
          {t("action.confirm")}
        </Button>
      </YStack>
    </ScrollView>
  )
}
