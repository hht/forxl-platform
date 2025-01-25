import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { cancelDeposit, confirmDeposit } from "~/api/wallet"
import {
  Button,
  Dialog,
  Figure,
  Popup,
  ScrollView,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useWalletStore } from "~/hooks/useStore"
import { formatDecimal, trimHTML } from "~/lib/utils"
import colors from "~/theme/colors"
import { DepositSteps } from "~/widgets/(home)/deposit/confirm/steps"
import { DepositSummary } from "~/widgets/(home)/deposit/confirm/summary"
import { AccountCard } from "~/widgets/shared/account-card"
import { AttentionCard } from "~/widgets/shared/attention-card"
import { InfoCard } from "~/widgets/shared/info-card"

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { depositResult, image, depositMethod } = useWalletStore()
  const [visible, setVisible] = useState(false)
  const { run, loading } = useRequest(confirmDeposit, {
    manual: true,
    onSuccess: () => {
      setVisible(false)
      router.back()
      toast.show(t("wallet.depositSuccess"))
    },
  })
  const { run: cancel, loading: cancelling } = useRequest(cancelDeposit, {
    manual: true,
    onSuccess: () => {
      toast.show(t("wallet.depositCancelled"))
      router.back()
    },
  })
  useUnmount(() => {
    useWalletStore.setState({ image: undefined })
  })
  return (
    <Fragment>
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: t("wallet.deposit") }} />
        <YStack p="$md" gap={20} pb={bottom + 16}>
          {depositResult?.payType === 3 ? (
            <Fragment>
              <AttentionCard>
                {t("wallet.depositPaymentPrompt", {
                  amount: formatDecimal(depositResult?.transferAmount),
                  unit: depositResult?.currency,
                })}
              </AttentionCard>
              <DepositSummary />
              <Text subject bold>
                {t("wallet.depositSteps")}
              </Text>
            </Fragment>
          ) : (
            <Fragment>
              <AccountCard />
              <InfoCard>
                {t("wallet.minimumDepositPrompt", {
                  min: `${depositMethod?.incomeMoneyMin}`,
                })}
              </InfoCard>
              {depositMethod?.remark ? (
                <InfoCard>{trimHTML(depositMethod.remark)}</InfoCard>
              ) : null}
              <YStack gap="$sm">
                <Text heading>{t("wallet.addressPrompt")}</Text>
                <Text col="$secondary">{t("wallet.addressPromptDesc")}</Text>
              </YStack>
            </Fragment>
          )}

          <DepositSteps />
          {depositResult?.payType === 3 ? (
            <XStack gap="$md">
              <Button
                type="accent"
                f={1}
                disabled={cancelling || loading}
                onPress={() => {
                  if (depositResult?.orderNo) {
                    cancel(depositResult)
                  }
                }}
              >
                {t("wallet.cancelOrder")}
              </Button>
              <Button
                f={1}
                disabled={loading || !image || cancelling}
                onPress={() => {
                  setVisible(true)
                }}
              >
                {t("action.submit")}
              </Button>
            </XStack>
          ) : (
            <XStack>
              <Button
                f={1}
                onPress={() => {
                  router.back()
                  router.back()
                }}
              >
                {t("action.done")}
              </Button>
            </XStack>
          )}
        </YStack>
      </ScrollView>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog br="$md">
          <YStack ai="center" px="$md" gap={12}>
            <Figure name="tip" color={colors.warning} width={88} />
            <Text subject>{t("wallet.tips")}</Text>
            <Text col="$secondary" ta="center">
              {t("wallet.depositConfirmPrompt")}
            </Text>
          </YStack>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                setVisible(false)
              }}
            >
              {t("wallet.thinkAgain")}
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={() => {
                if (!image || !depositResult?.orderNo) return
                run({
                  payScreen: image,
                  orderNo: depositResult?.orderNo,
                  ...useWalletStore.getState().depositRequest,
                })
              }}
            >
              {t("action.submit")}
            </Button>
          </XStack>
        </Dialog>
      </Popup>
    </Fragment>
  )
}
