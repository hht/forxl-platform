import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { FC, Fragment, ReactNode, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import {
  CHANNEL_DESCRIPTION,
  getStatusColor,
  OPERATION_DESCRIPTION,
  STATUS_DESCRIPTION,
} from "./utils"

import { getFundHistory } from "~/api/wallet"
import {
  BottomSheet,
  copyToClipboard,
  Icon,
  Image,
  Row,
  Text,
  XStack,
  YStack,
} from "~/components"
import { getDate } from "~/hooks/useLocale"
import { formatCurrency, formatDecimal } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

export const useTransactionStore = createWithEqualityFn<{
  data?: Awaited<ReturnType<typeof getFundHistory>>["list"][number]

  reloadKey?: string | undefined
}>((set) => ({
  current: undefined,
}))

const ListItem: FC<{ title: string; value: ReactNode; copyable?: boolean }> = ({
  title,
  value,
  copyable = false,
}) => {
  return (
    <XStack gap={40} ai="center" py="$sm">
      <Text col="$secondary">{title}</Text>
      <XStack f={1} jc="flex-end" ai="center" gap="$xs">
        <Text ta="right">{value}</Text>
        {copyable ? (
          <XStack
            hitSlop={16}
            onPress={() => {
              copyToClipboard(value as string)
            }}
          >
            <Icon name="copy" size={12} color={colors.primary}></Icon>
          </XStack>
        ) : null}
      </XStack>
    </XStack>
  )
}

export const TransactionDetails: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { data, reloadKey } = useTransactionStore((state) => state, shallow)
  const ref = useRef<BottomSheetModal>(null)
  useEffect(() => {
    if (reloadKey) {
      ref.current?.present()
    }
  }, [reloadKey])
  const isDeposit = !data?.wdAccount
  const isCrypto = data?.recordType === 0 || data?.recordType === 1
  if (!data) return null
  return (
    <BottomSheet ref={ref} index={0} title="    ">
      <YStack p="$md" mt={-60} pb={bottom + 16}>
        <YStack ai="center" gap="$md" bbc="$border" bbw={1} pb="$md">
          <XStack
            br={36}
            boc="$border"
            bw={1}
            w={72}
            h={72}
            ai="center"
            jc="center"
          >
            <Icon
              name={isDeposit ? "addFunds" : "withdraw"}
              size={48}
              color={getStatusColor(data.status)}
            ></Icon>
          </XStack>
          <Text subject>
            {t(OPERATION_DESCRIPTION[data.operationType] as any)}
          </Text>
          <Text col={getStatusColor(data.status)}>
            {t(STATUS_DESCRIPTION[data.status] as any)}
          </Text>
          <Row px="$md" py="$sm" br="$sm" boc="$border" bw={1} gap="$sm">
            {data.picUrl ? (
              <Image source={{ uri: data.picUrl }} w="$md" h="$md" br="$md" />
            ) : null}
            <Text col="$secondary">
              {t(CHANNEL_DESCRIPTION[data.recordType] as any)}
            </Text>
          </Row>
          {data.refuseReason ? (
            <XStack
              bc={toRGBA(colors.destructive, 0.1)}
              br="$sm"
              gap="$sm"
              px={12}
              py="$sm"
            >
              <Icon name="info" size={16} color={colors.destructive}></Icon>
              <Text col={colors.destructive}>{data.refuseReason}</Text>
            </XStack>
          ) : null}
        </YStack>
        <YStack py="$md">
          <ListItem
            title={t("wallet.amount")}
            value={formatCurrency(data.realAmount)}
          />
          {isDeposit ? null : (
            <Fragment>
              <ListItem
                title={t("trade.commission")}
                value={formatCurrency(data.feeAmount)}
              />
              <ListItem
                title={t("wallet.youGet")}
                value={formatCurrency(data.selectAmountUsdt)}
              />
            </Fragment>
          )}
          {isCrypto ? null : (
            <Fragment>
              <ListItem
                title={t("wallet.currency")}
                value={data.transferCurrency}
              />
              <ListItem
                title={t("wallet.localCurrency")}
                value={formatDecimal(data.transferAmount)}
              />
            </Fragment>
          )}
          <ListItem
            title={t("wallet.transactionId")}
            value={data.id}
            copyable
          />
          {data.wdAccount ? (
            <ListItem
              title={t(
                isDeposit ? "wallet.paymentAddress" : "wallet.walletAddress"
              )}
              value={data.wdAccount}
              copyable
            />
          ) : null}
          <ListItem
            title={t("wallet.created")}
            value={getDate(data.addTime).format("MMM DD, YYYY HH:mm")}
          />
        </YStack>
      </YStack>
    </BottomSheet>
  )
}
