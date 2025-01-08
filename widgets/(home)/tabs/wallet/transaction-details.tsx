import BottomSheetBase from "@gorhom/bottom-sheet"
import { FC, Fragment, ReactNode, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import {
  CHANNEL_DESCRIPTION,
  DEPOSIT_STATUS,
  getStatusColor,
  WITHDRAW_STATUS,
} from "./utils"

import { getFundHistory } from "~/api/wallet"
import {
  BottomSheet,
  copyToClipboard,
  Icon,
  Text,
  XStack,
  YStack,
} from "~/components"
import { dayjs, formatDecimal } from "~/lib/utils"
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
        <Text>{value}</Text>
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
  const ref = useRef<BottomSheetBase>(null)
  useEffect(() => {
    if (reloadKey) {
      ref.current?.expand()
    }
  }, [reloadKey])
  const isDeposit = data?.operationType === 9001
  const isCrypto = data?.recordType === 0 || data?.recordType === 1
  if (!data) return null
  return (
    <BottomSheet
      ref={ref}
      index={0}
      title="    "
      onClose={() => ref.current?.close()}
    >
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
              color={isDeposit ? colors.primary : colors.destructive}
            ></Icon>
          </XStack>
          <Text subject>
            {t(isDeposit ? "wallet.addFunds" : "wallet.withdraw")}
          </Text>
          <Text col={getStatusColor(data.status)}>
            {t(
              isDeposit
                ? (DEPOSIT_STATUS[data.status] as any)
                : WITHDRAW_STATUS[data.status]
            )}
          </Text>
          <XStack px="$md" py="$sm" br="$sm" boc="$border" bw={1}>
            <Text col="$secondary">
              {t(CHANNEL_DESCRIPTION[data.recordType] as any)}
            </Text>
          </XStack>
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
            title={t(
              isDeposit ? "wallet.depositAmount" : "wallet.withdrawAmount"
            )}
            value={`$${formatDecimal(data.realAmount)}`}
          />
          {isDeposit ? null : (
            <Fragment>
              <ListItem
                title={t("trade.commission")}
                value={`$${formatDecimal(data.feeValue)}`}
              />
              <ListItem
                title={t("wallet.youGet")}
                value={`$${formatDecimal(data.realAmount - data.feeValue)}`}
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
          {isCrypto ? (
            <ListItem
              title={t(
                isDeposit ? "wallet.paymentAddress" : "wallet.walletAddress"
              )}
              value={data.trc20Address}
              copyable
            />
          ) : null}
          <ListItem
            title={t("wallet.created")}
            value={dayjs(data.addTime).format("MMM DD, YYYY HH:mm")}
          />
        </YStack>
      </YStack>
    </BottomSheet>
  )
}
