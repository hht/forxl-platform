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
import {
  DepositResult,
  usePaymentStore,
  useWalletStore,
} from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import { Crypto } from "~/widgets/(home)/deposit/form/crypto"
import { Fiat } from "~/widgets/(home)/deposit/form/fiat"
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
  const { method, data } = usePaymentStore()
  const { run, loading } = useRequest(deposit, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        useWalletStore.setState({
          depositResult: data as DepositResult,
          depositRequest: usePaymentStore.getState().data,
        })
        router.push("/deposit/confirm")
      }
    },
  })
  useUnmount(() => {
    usePaymentStore.setState({
      method: undefined,
      data: {
        payAccount: "",
        payBank: "",
        payName: "",
      },
    })
  })
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.deposit") }} />
      <YStack p="$md" gap={20} pb={bottom + 16}>
        <AccountCard />
        {method?.payType === 102 ? <Crypto /> : null}
        {method?.payType === 3 ? <Fiat /> : null}
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
          value={data.amount}
          max={method?.incomeMoneyMax ?? 9999999}
          addonAfter={<Unit>USD</Unit>}
          disableValidation
          onChange={(amount) =>
            usePaymentStore.setState({
              data: { ...usePaymentStore.getState().data, amount },
            })
          }
        />
        <DepositSummary />
        <Button
          isLoading={loading}
          disabled={
            loading ||
            (data.amount ?? 0) < (method?.incomeMoneyMin ?? -Infinity) ||
            (data.amount ?? 0) > (method?.incomeMoneyMax ?? Infinity)
          }
          onPress={() => {
            run({
              code: method?.code!,
              amount: data.amount ?? 0,
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
