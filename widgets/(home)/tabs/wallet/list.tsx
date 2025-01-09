import { FC, Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Shortcuts } from "./short-cuts"
import {
  CHANNEL_DESCRIPTION,
  DEPOSIT_STATUS,
  getStatusColor,
  WITHDRAW_STATUS,
} from "./utils"

import { getFundHistory } from "~/api/wallet"
import { Icon, Image, Text, XStack, YStack } from "~/components"
import { getRecentDate } from "~/hooks/useLocale"
import { formatDecimal } from "~/lib/utils"

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
          <Text fos={11} col="$secondary">
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
            name={data.operationType === 9001 ? "addFunds" : "withdraw"}
            color={getStatusColor(data.status)}
            size={24}
          />
        </XStack>
        <YStack f={1} gap="$sm">
          <Text fow="bold">
            {t(
              data.operationType === 9001
                ? "wallet.addFunds"
                : "wallet.withdraw"
            )}
          </Text>
          <Text col={getStatusColor(data.status)}>
            {t(
              data.operationType === 9001
                ? (DEPOSIT_STATUS[data.status] as any)
                : WITHDRAW_STATUS[data.status]
            )}
          </Text>
        </YStack>
        <YStack gap="$sm" ai="flex-end">
          <Text
            fow="bold"
            col={data.realAmount > 0 ? "$primary" : "$destructive"}
          >{`$${formatDecimal(data.realAmount)}`}</Text>
          <Text col="$secondary">
            {t(CHANNEL_DESCRIPTION[data.recordType] as any)}
          </Text>
        </YStack>
      </XStack>
    </Fragment>
  )
}
export const ListHeaderComponent = () => (
  <YStack gap="$md" py="$md">
    <Shortcuts />
  </YStack>
)

export const ListEmptyComponent: FC<{ loading: boolean }> = ({ loading }) => {
  const { t } = useTranslation()
  if (loading) return null
  return (
    <YStack gap="$md" py="$md" f={1}>
      <Image
        w="100%"
        br="$sm"
        aspectRatio={343 / 120}
        source={require("~/assets/images/widgets/bonus.jpg")}
      />
      <YStack f={1} ai="center" jc="center">
        <Text col="$tertiary">{t("wallet.empty")}</Text>
      </YStack>
    </YStack>
  )
}
