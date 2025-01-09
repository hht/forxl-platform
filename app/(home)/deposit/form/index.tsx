import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { FC, PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { deposit } from "~/api/wallet"
import {
  Button,
  Card,
  Input,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { DepositResult, useWalletStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import { DepositForm } from "~/widgets/(home)/deposit/form/form"
import { DepositSummary } from "~/widgets/(home)/deposit/form/summary"
import { AccountCard } from "~/widgets/shared/account-card"

const Unit: FC<PropsWithChildren> = ({ children }) => (
  <XStack pl="$md" h="100%" ai="center" jc="center" blc="$border" blw={1}>
    <Text>{children}</Text>
  </XStack>
)

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { method, depositRequest } = useWalletStore()
  const { run, loading } = useRequest(deposit, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        useWalletStore.setState({
          depositResult: data as DepositResult,
        })
        router.push("/deposit/confirm")
      }
    },
  })
  useUnmount(() => {
    useWalletStore.getState().clean()
  })
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.deposit") }} />
      <YStack p="$md" gap={20} pb={bottom + 16}>
        <AccountCard />
        <DepositForm />
        <Card>
          <Text>
            {t("wallet.depositRangePrompt", {
              min: `$${formatDecimal(method?.incomeMoneyMin ?? 0)}`,
              max: `$${formatDecimal(method?.incomeMoneyMax ?? 0)}`,
              unit: "USD",
            })}
          </Text>
        </Card>
        <Input.Decimal
          label={t("wallet.depositAmount")}
          value={depositRequest.amount}
          max={method?.incomeMoneyMax ?? 9999999}
          addonAfter={<Unit>USD</Unit>}
          disableValidation
          onChange={(amount) =>
            useWalletStore.setState({
              depositRequest: { ...depositRequest, amount },
            })
          }
        />
        <DepositSummary />
        <Button
          isLoading={loading}
          disabled={
            loading ||
            (depositRequest.amount ?? 0) <
              (method?.incomeMoneyMin ?? -Infinity) ||
            (depositRequest.amount ?? 0) >
              (method?.incomeMoneyMax ?? Infinity) ||
            (method?.payType === 3 &&
              (!depositRequest.payBank ||
                !depositRequest.payName ||
                !depositRequest.payAccount))
          }
          onPress={() => {
            run({
              code: method?.code!,
              amount: depositRequest.amount ?? 0,
              type: method?.payType ?? 0,
              paymentId: method?.id,
            })
          }}
        >
          {t("wallet.deposit")}
        </Button>
      </YStack>
    </ScrollView>
  )
}
