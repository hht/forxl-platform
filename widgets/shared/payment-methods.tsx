import { router } from "expo-router"
import { FC, Fragment } from "react"

import { getPaymentMethods, getWithdrawalMethods } from "~/api/wallet"
import {
  Card,
  Icon,
  Image,
  Separator,
  Text,
  XStack,
  YStack,
} from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useWalletStore } from "~/hooks/useStore"
import { formatDecimal, t } from "~/lib/utils"

export const PaymentMethodDescription: FC<{
  method: PaymentMethod
}> = ({ method }) => {
  return (
    <Fragment>
      <Card.Item title={t("trade.commission")}>
        {method.fee ? formatDecimal(method.fee) : t("wallet.networkFeeOnly")}
      </Card.Item>
      <Card.Item title={t("wallet.processingTime")}>
        {method.arrivalTimeDesc || t("wallet.instantly")}
      </Card.Item>
      {/* <ListItem title={t("wallet.limit")}>
        <Text className="text-white">
          {method.incomeMoneyMin
            ? `${t("wallet.from")} ${formatDecimal(method.incomeMoneyMin)} USD`
            : ""}
        </Text>
        <Text className="text-white">
          {method.incomeMoneyMax
            ? `${t("wallet.to")} ${formatDecimal(method.incomeMoneyMax)} USD `
            : ""}
        </Text>
      </ListItem> */}
    </Fragment>
  )
}

export const WithdrawMethodDescription: FC<{
  method: WithdrawMethod
}> = ({ method }) => {
  return (
    <Fragment>
      <Card.Item title={t("trade.commission")}>
        {method.feeValue
          ? `${formatDecimal(method.feeValue)}%`
          : t("wallet.networkFeeOnly")}
      </Card.Item>
      <Card.Item title={t("wallet.processingTime")}>
        {method.arrivalTimeDesc ?? ""}
      </Card.Item>
      <Card.Item title={t("wallet.limit")}>
        <Text className="text-white">
          {method.minAmount
            ? `${t("wallet.from")} ${formatDecimal(method.minAmount)} USD`
            : ""}
        </Text>
        {/* <Text className="text-white">
          {data.maxAmount
            ? `${t("wallet.to")} ${formatDecimal(data.maxAmount)} USD `
            : ""}
        </Text> */}
      </Card.Item>
    </Fragment>
  )
}

export const PaymentMethodCard: FC<{
  method: PaymentMethod
}> = ({ method }) => {
  return (
    <Card
      gap="$md"
      onPress={() => {
        useWalletStore.setState({
          method,
        })
        router.push("/deposit/form")
      }}
    >
      <XStack ai="center" jc="space-between">
        <YStack gap="$sm">
          <Text fos={17} lh={20} fow="bold">
            {method.name}
          </Text>
          <XStack ai="center" gap="$sm">
            {method.userAuth ? <Icon name="creditCard" size={16} /> : null}
            <Icon name="twoFactor" size={16} />
          </XStack>
        </YStack>
        <Image source={{ uri: method.picUrl }} w={40} h={40} />
      </XStack>
      <Separator />
      <PaymentMethodDescription method={method} />
    </Card>
  )
}

export const WithdrawMethodCard: FC<{
  method: WithdrawMethod
}> = ({ method }) => {
  return (
    <Card gap="$md">
      <XStack ai="center" jc="space-between">
        <YStack gap="$sm">
          <Text fos={17} lh={20} fow="bold">
            {method.channelName}
          </Text>
          <XStack ai="center" gap="$sm">
            {method.userAuth ? <Icon name="creditCard" size={16} /> : null}
            <Icon name="twoFactor" size={16} />
          </XStack>
        </YStack>
        <Image source={{ uri: method.picUrl }} w={40} h={40} />
      </XStack>
      <Separator />
      <WithdrawMethodDescription method={method} />
    </Card>
  )
}

export const PaymentMethods: FC = () => {
  const { data } = useRequest(getPaymentMethods, {
    cacheKey: CACHE_KEY.IN_USE_PAYMENT,
  })
  return (
    <Fragment>
      {data?.map((method) => (
        <PaymentMethodCard key={method.id} method={method} />
      ))}
    </Fragment>
  )
}

export const WithdrawMethods: FC = () => {
  const { data } = useRequest(getWithdrawalMethods, {
    cacheKey: CACHE_KEY.IN_USE_WITHDRAW,
  })
  return (
    <Fragment>
      {data?.map((method) => (
        <WithdrawMethodCard key={method.id} method={method} />
      ))}
    </Fragment>
  )
}
