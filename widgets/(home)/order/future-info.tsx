import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { MarketInfo } from './market-info'

import { Text, XStack, YStack } from '~/components'
import { useQuotesStore } from '~/hooks/useStore'
import { formatDecimal } from '~/lib/utils'

const ListItem: FC<{ title: string; value: string; desc?: string }> = ({
  title,
  value,
  desc,
}) => {
  return (
    <YStack p="$md" gap="$sm">
      <XStack ai="center" jc="space-between">
        <Text fow="bold">{title}</Text>
        <Text fow="bold">{value}</Text>
      </XStack>
      {desc ? (
        <Text fos={11} col="$secondary">
          {desc}
        </Text>
      ) : null}
    </YStack>
  )
}

export const FutureInfo: FC<{
  future?: FuturesDetail
  onPress: () => void
}> = ({ future, onPress }) => {
  const { t } = useTranslation()
  const currentFuture = useQuotesStore((state) => state.currentFuture)
  if (!future) {
    return null
  }
  return (
    <Fragment>
      <YStack p="$md" gap="$md" w="100%">
        <ListItem
          title={t("trade.contractSize")}
          value={formatDecimal(future.futuresParam?.multiplier ?? 0)}
          desc={t("trade.contractSizeDesc")}
        />
        <ListItem
          title={t("trade.executionType")}
          value={t("trade.market")}
          desc={t("trade.executionTypeDesc")}
        />
        <ListItem
          title={t("order.commission")}
          value={t("trade.perLot", {
            amount: formatDecimal(future.futuresParam?.tradingFee ?? 0),
          })}
          desc={t("trade.commissionDesc")}
        />
        <ListItem
          title={t("trade.minVolume")}
          value={t("trade.lots", {
            amount: formatDecimal(future.futuresParam?.minVolume ?? 0),
          })}
        />
        <ListItem
          title={t("trade.maxVolume")}
          value={t("trade.lots", {
            amount: formatDecimal(future.futuresParam?.maxVolume ?? 0),
          })}
        />
        <ListItem
          title={t("trade.hedgedMargin")}
          value={formatDecimal(future.futuresParam?.fixDepositRatio ?? 0)}
          desc={t("trade.hedgedMarginDesc")}
        />
        <ListItem
          title={t("trade.swapType")}
          value={future.futures?.currency ?? ""}
          desc={t("trade.swapTypeDesc")}
        />
        <ListItem
          title={t("trade.long")}
          value={formatDecimal(future.futuresParam?.overNightFee ?? 0)}
          desc={t("trade.longDesc")}
        />
        <ListItem
          title={t("trade.short")}
          value={formatDecimal(future.futuresParam?.downOverNightFee ?? 0)}
          desc={t("trade.shortDesc")}
        />
        <ListItem
          title={t("trade.description")}
          value=""
          desc={future.futures?.remark ?? ""}
        />
      </YStack>
      <MarketInfo
        future={future}
        currentFuture={currentFuture}
        onPress={onPress}
      />
    </Fragment>
  )
}
