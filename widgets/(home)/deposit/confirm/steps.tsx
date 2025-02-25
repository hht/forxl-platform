import { FC } from "react"
import { useTranslation } from "react-i18next"
import QRCode from "react-native-qrcode-skia"

import { UploadCard } from "./upload-card"

import {
  Card,
  Copyable,
  copyToClipboard,
  Separator,
  Stepper,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useWalletStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"
import { PaymentMethodDescription } from "~/widgets/shared/payment-methods"

export const DepositSteps: FC = () => {
  const { t } = useTranslation()
  const { depositResult, depositMethod } = useWalletStore()
  if (depositResult?.payType === 3) {
    return (
      <Stepper>
        <Text col="$secondary">{t("wallet.openWalletDesc")}</Text>
        <YStack gap="$md">
          <XStack gap="$xs">
            <Text col="$secondary">{t("wallet.transferToSeller")}</Text>
            <Copyable>{`${formatDecimal(depositResult?.transferAmount ?? 0)} ${depositResult?.currency}`}</Copyable>
          </XStack>
          <Card gap={0}>
            <Text mb={12} bold>
              {t("wallet.paymentInformation")}
            </Text>
            <Card.Item title={t("wallet.fullName")}>
              <Copyable>{depositResult?.payName}</Copyable>
            </Card.Item>
            <Card.Item title={t("wallet.depositBank")}>
              <Copyable>{depositResult?.payBank}</Copyable>
            </Card.Item>
            <Card.Item title={t("wallet.sellerBankCard")}>
              <Copyable>{depositResult?.payAccount}</Copyable>
            </Card.Item>
          </Card>
        </YStack>
        <YStack gap="$md">
          <Text col="$secondary">{t("wallet.uploadDesc")}</Text>
          <UploadCard />
        </YStack>
        <Text col="$secondary">{t("wallet.confirmDepositDesc")}</Text>
      </Stepper>
    )
  }
  return (
    <Card ai="center" jc="center" gap={12}>
      <XStack p="$md" br="$sm" bc="white">
        <QRCode
          value={depositResult?.address ?? ""}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 16,
          }}
          size={128}
          shapeOptions={{
            shape: "circle",
            eyePatternShape: "rounded",
            eyePatternGap: 0,
            gap: 0,
          }}
        ></QRCode>
      </XStack>
      <XStack gap={12} ai="center">
        <Text f={1} bold>
          {depositResult?.address}
        </Text>
        <XStack
          h={24}
          ai="center"
          jc="center"
          bc={toRGBA(colors.primary, 0.1)}
          px="$sm"
          br={12}
          hitSlop={16}
          onPress={() => {
            copyToClipboard(depositResult?.address ?? "")
          }}
        >
          <Text col="$primary" bold lh={24}>
            {t("action.copy")}
          </Text>
        </XStack>
      </XStack>
      <Separator />
      {depositMethod ? (
        <YStack w="100%">
          <PaymentMethodDescription method={depositMethod} />
          {depositMethod.remark3 ? (
            <Card.Item title={depositMethod.remark3}>{""}</Card.Item>
          ) : null}
        </YStack>
      ) : null}
    </Card>
  )
}
