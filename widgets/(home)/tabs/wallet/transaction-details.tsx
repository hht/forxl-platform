import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { FC, Fragment, ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { cancelDeposit, getFundHistory, getPendingPayment } from '~/api/wallet'
import {
  BottomSheet, Button, copyToClipboard, Icon, Image, Row, Text, toast, XStack, YStack
} from '~/components'
import { getDate } from '~/hooks/useLocale'
import { useRequest } from '~/hooks/useRequest'
import { useWalletStore } from '~/hooks/useStore'
import { formatCurrency, formatDecimal } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'

import {
  CHANNEL_DESCRIPTION, getStatusColor, OPERATION_DESCRIPTION, STATUS_DESCRIPTION
} from './utils'

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

const FundDetail: FC<{
  data: Awaited<ReturnType<typeof getFundHistory>>["list"][number]
}> = ({ data }) => {
  const { t } = useTranslation()
  if (data.operationType === 9004 || data.operationType === 9005) {
    return <ListItem title={t("wallet.remark")} value={data.remark} />
  }
  switch (data.recordType) {
    case 0:
    case 1:
    case 102:
      return data.operationType === 9001 ? (
        <ListItem
          title={t("wallet.paymentAddress")}
          value={data.wdAccount}
          copyable
        />
      ) : data.operationType === 9002 ? (
        <Fragment>
          <ListItem
            title={t("trade.commission")}
            value={formatCurrency(data.feeAmount)}
          />
          <ListItem
            title={t("wallet.youGet")}
            value={formatCurrency(data.selectAmountUsdt)}
          />
          <ListItem
            title={t("wallet.walletAddress")}
            value={data.wdAccount}
            copyable
          />
        </Fragment>
      ) : (
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
      )
    default:
      return data.operationType === 9002 ? (
        <Fragment>
          <ListItem
            title={t("trade.commission")}
            value={formatCurrency(data.feeAmount)}
          />
          <ListItem
            title={t("wallet.youGet")}
            value={formatCurrency(data.selectAmountUsdt)}
          />
          <ListItem
            title={t("wallet.walletAddress")}
            value={data.wdAccount}
            copyable
          />
        </Fragment>
      ) : (
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
      )
  }
}

const FundAction: FC<{
  data: Awaited<ReturnType<typeof getFundHistory>>["list"][number]
  onSuccess: () => void
}> = ({ data, onSuccess }) => {
  const { t } = useTranslation()
  const { run: cancel, loading: cancelling } = useRequest(cancelDeposit, {
    manual: true,
    onSuccess: () => {
      toast.show(t("wallet.depositCancelled"))
      onSuccess()
    },
  })
  const { run, loading } = useRequest(getPendingPayment, {
    manual: true,
    onSuccess: (data) => {
      if (data.payType === 3) {
        useWalletStore.setState({
          depositRequest: {
            payAccount: data.userPayAccount,
            payBank: data.userPayBank,
            payName: data.userPayName,
            amount: data.usdAmount,
          },
          depositResult: data,
        })
        onSuccess()
        router.push(`/deposit/confirm`)
      }
    },
  })
  return data.operationType === 9001 &&
    data.recordType === 3 &&
    data.status === 6 ? (
    <Row w="100%" gap="$md">
      <Button
        type="primary"
        f={1}
        className="w-36"
        isLoading={loading}
        onPress={() => {
          run(data.code)
        }}
      >
        {t("action.continueToPay")}
      </Button>
      <Button
        type="destructive"
        f={1}
        className="w-36"
        isLoading={cancelling}
        onPress={() =>
          cancel({
            orderNo: `${data.id}`,
          })
        }
      >
        {t("action.cancelPayment")}
      </Button>
    </Row>
  ) : null
}

export const TransactionDetails: FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { data, reloadKey } = useTransactionStore((state) => state, shallow)
  const ref = useRef<BottomSheetModal>(null)
  useEffect(() => {
    if (reloadKey) {
      ref.current?.present()
    }
  }, [reloadKey])
  const isDeposit = ![9002, 9005].includes(data?.operationType ?? 0)
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
              {data.recordType < 3
                ? data.channelName
                : t(CHANNEL_DESCRIPTION[data.recordType] as any)}
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
          <FundDetail data={data} />
          <ListItem
            title={t("wallet.transactionId")}
            value={data.recordType !== 5 ? data.id : data.recordId}
            copyable
          />
          <ListItem
            title={t("wallet.created")}
            value={getDate(data.addTime).format("MMM DD, YYYY HH:mm:ss")}
          />
        </YStack>
        <FundAction
          data={data}
          onSuccess={() => {
            ref.current?.dismiss()
            onSuccess()
          }}
        />
      </YStack>
    </BottomSheet>
  )
}
