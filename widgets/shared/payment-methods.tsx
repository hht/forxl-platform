import _ from "lodash"
import { FC, Fragment, ReactNode } from "react"

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
import { formatDecimal, t } from "~/lib/utils"

const ListItem: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <XStack ai="center" jc="space-between" py="$sm">
      <Text col="$secondary">{title}</Text>
      {_.isString(children) ? <Text>{children}</Text> : children}
    </XStack>
  )
}

export const PaymentMethodDescription: FC<{
  data: PaymentMethod
}> = ({ data }) => {
  return (
    <Fragment>
      <ListItem title={t("trade.commission")}>
        {data.fee ? formatDecimal(data.fee) : t("wallet.networkFeeOnly")}
      </ListItem>
      <ListItem title={t("wallet.averageTime")}>
        {data.arrivalTimeDesc || t("wallet.instantly")}
      </ListItem>
      <ListItem title={t("wallet.limit")}>
        <Text className="text-white">
          {data.incomeMoneyMin
            ? `${t("wallet.from")} ${formatDecimal(data.incomeMoneyMin)} USD`
            : ""}
        </Text>
        {/* <Text className="text-white">
          {data.incomeMoneyMax
            ? `${t("wallet.to")} ${formatDecimal(data.incomeMoneyMax)} USD `
            : ""}
        </Text> */}
      </ListItem>
    </Fragment>
  )
}

export const WithdrawMethodDescription: FC<{
  data: WithdrawMethod
}> = ({ data }) => {
  return (
    <Fragment>
      <ListItem title={t("trade.commission")}>
        {data.feeValue
          ? `${formatDecimal(data.feeValue)}%`
          : t("wallet.networkFeeOnly")}
      </ListItem>
      <ListItem title={t("wallet.averageTime")}>
        {data.arrivalTimeDesc ?? ""}
      </ListItem>
      <ListItem title={t("wallet.limit")}>
        <Text className="text-white">
          {data.minAmount
            ? `${t("wallet.from")} ${formatDecimal(data.minAmount)} USD`
            : ""}
        </Text>
        {/* <Text className="text-white">
          {data.maxAmount
            ? `${t("wallet.to")} ${formatDecimal(data.maxAmount)} USD `
            : ""}
        </Text> */}
      </ListItem>
    </Fragment>
  )
}

export const PaymentMethodCard: FC<{
  data: PaymentMethod
}> = ({ data }) => {
  return (
    <Card gap="$md">
      <XStack ai="center" jc="space-between">
        <YStack gap="$sm">
          <Text fos={17} lh={20} fow="bold">
            {data.name}
          </Text>
          <XStack ai="center" gap="$sm">
            {data.userAuth ? <Icon name="creditCard" size={16} /> : null}
            <Icon name="twoFactor" size={16} />
          </XStack>
        </YStack>
        <Image source={{ uri: data.picUrl }} w={40} h={40} />
      </XStack>
      <Separator />
      <PaymentMethodDescription data={data} />
    </Card>
  )
}

export const WithdrawMethodCard: FC<{
  data: WithdrawMethod
}> = ({ data }) => {
  return (
    <Card gap="$md">
      <XStack ai="center" jc="space-between">
        <YStack gap="$sm">
          <Text fos={17} lh={20} fow="bold">
            {data.channelName}
          </Text>
          <XStack ai="center" gap="$sm">
            {data.userAuth ? <Icon name="creditCard" size={16} /> : null}
            <Icon name="twoFactor" size={16} />
          </XStack>
        </YStack>
        <Image source={{ uri: data.picUrl }} w={40} h={40} />
      </XStack>
      <Separator />
      <WithdrawMethodDescription data={data} />
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
        <PaymentMethodCard key={method.id} data={method} />
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
        <WithdrawMethodCard key={method.id} data={method} />
      ))}
    </Fragment>
  )
}
