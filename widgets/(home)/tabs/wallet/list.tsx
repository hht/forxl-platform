import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Banners } from "../dashboard/banners"
import { Shortcuts } from "./short-cuts"
import {
  CHANNEL_DESCRIPTION,
  getStatusColor,
  OPERATION_DESCRIPTION,
  STATUS_DESCRIPTION,
} from "./utils"

import { getFundHistory } from "~/api/wallet"
import { Icon, Text, XStack, YStack } from "~/components"
import { getRecentDate } from "~/hooks/useLocale"
import { formatCurrency } from "~/lib/utils"

export const ListItem: FC<{
  data: Awaited<ReturnType<typeof getFundHistory>>["list"][number]
  dateVisible?: boolean
  onPress: (
    v: Awaited<ReturnType<typeof getFundHistory>>["list"][number]
  ) => void
}> = ({ data, dateVisible, onPress }) => {
  const { t } = useTranslation()
  return (
    <Fragment>
      {dateVisible ? (
        <YStack pt="$sm" w="100%">
          <Text caption col="$secondary">
            {getRecentDate(data.addTime)}
          </Text>
        </YStack>
      ) : null}
      <XStack
        gap={18}
        py={12}
        onPress={() => {
          onPress(data)
        }}
      >
        <XStack
          ai="center"
          jc="center"
          w={36}
          h={36}
          br={18}
          boc="$border"
          bw={1}
          bg="$card/60"
        >
          <Icon
            name={data.wdAccount ? "withdraw" : "addFunds"}
            color={getStatusColor(data.status)}
            size={24}
          />
        </XStack>
        <YStack f={1} gap="$sm">
          <Text bold>
            {t(OPERATION_DESCRIPTION[data.operationType] as any)}
          </Text>
          <Text col={getStatusColor(data.status)}>
            {t(STATUS_DESCRIPTION[data.status] as any)}
          </Text>
        </YStack>
        <YStack gap="$sm" ai="flex-end">
          <Text bold col={data.realAmount > 0 ? "$primary" : "$destructive"}>
            {formatCurrency(data.realAmount)}
          </Text>
          <Text col="$secondary">
            {t(CHANNEL_DESCRIPTION[data.recordType] as any)}
          </Text>
        </YStack>
      </XStack>
    </Fragment>
  )
}
export const ListHeaderComponent = () => (
  <YStack py="$md">
    <Shortcuts />
    <Banners position={2} />
  </YStack>
)

export const ListEmptyComponent: FC<{ loading: boolean }> = ({ loading }) => {
  const { t } = useTranslation()
  if (loading) return null
  return (
    <YStack gap="$md" py="$md" f={1}>
      <YStack f={1} ai="center" jc="center">
        <Text col="$tertiary">{t("wallet.empty")}</Text>
      </YStack>
    </YStack>
  )
}
