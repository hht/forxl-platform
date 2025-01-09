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
  Icon,
  Popup,
  ScrollView,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useWalletStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"
import { DepositSteps } from "~/widgets/(home)/deposit/confirm/steps"
import { DepositSummary } from "~/widgets/(home)/deposit/confirm/summary"
import { AttentionCard } from "~/widgets/shared/attention-card"

export default function Page() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { depositResult, image } = useWalletStore()
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
  return (
    <Fragment>
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: t("wallet.deposit") }} />
        <YStack p="$md" gap={20} pb={bottom + 16}>
          <AttentionCard>
            {t("wallet.depositPaymentPrompt", {
              amount: formatDecimal(
                (depositResult?.payType === 3
                  ? depositResult?.transferAmount
                  : depositResult?.price) ?? 0
              ),
              unit:
                depositResult?.payType === 3 ? depositResult?.currency : "USDT",
            })}
          </AttentionCard>
          <DepositSummary />
          <Text subject>{t("wallet.depositSteps")}</Text>
          <DepositSteps />
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
        </YStack>
      </ScrollView>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog br="$md">
          <YStack ai="center" px="$md" gap={12}>
            <Figure name="tip" color={colors.warning} width={88} />
            <Text fos={20} lh={24}>
              {t("wallet.tips")}
            </Text>
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
