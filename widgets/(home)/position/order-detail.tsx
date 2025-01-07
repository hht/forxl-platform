import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { getFuture } from '~/api/trade'
import { Icon, Text, XStack } from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useOrderStore } from '~/hooks/useStore'
import { dayjs, formatDecimal } from '~/lib/utils'
import colors from '~/theme/colors'
import { ListItem } from '~/widgets/(home)/position/list-item'
import { PriceCell } from '~/widgets/shared/price-cell'
import { ProfitCell } from '~/widgets/shared/profit-cell'

export const OrderDetail = () => {
  const { t } = useTranslation()
  const dict = t("order", {
    returnObjects: true,
  })
  const { currentPosition, activeIndex } = useOrderStore(
    (state) => ({
      currentPosition: state.currentPosition,
      activeIndex: state.activeIndex,
    }),
    shallow
  )
  const { data } = useRequest(() => {
    return getFuture(currentPosition?.futuresCode!)
  })
  if (!currentPosition) return null
  if (activeIndex !== 2) {
    return (
      <Fragment>
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$sm">
            <Text
              fos={17}
              lh={20}
              fow="900"
              col={
                currentPosition?.openSafe === 0 ? "$primary" : "$destructive"
              }
            >
              {t(
                currentPosition?.openSafe === 0
                  ? "positions.buy"
                  : "positions.sell"
              )}
            </Text>
            <Text fos={17} lh={20} fow="900">
              {currentPosition.futuresCode}
            </Text>
          </XStack>
          <ProfitCell data={currentPosition} fos={17} lh={20} fow="900" />
        </XStack>
        <XStack ai="center" jc="space-between" py="$md" bbc="$border" bbw={1}>
          <Text col="$secondary">{data?.futures?.futuresName}</Text>
          <XStack gap="$sm" ai="center">
            <XStack ai="center" gap="$xs" jc="center">
              <Text ff="$mono">
                {formatDecimal(
                  currentPosition.price ?? 0,
                  currentPosition.volatility
                )}
              </Text>
              <XStack rotate="180deg">
                <Icon name="arrowLeft" color={colors.text} size={12} />
              </XStack>
              <PriceCell data={currentPosition} col="$text" />
            </XStack>
          </XStack>
        </XStack>
        <ListItem label={dict.volume}>{`${currentPosition.position}`}</ListItem>
        <ListItem
          label={dict.margin}
        >{`$${formatDecimal(currentPosition.securityDeposit ?? 0)}`}</ListItem>
        <ListItem
          label={dict.commission}
        >{`$${formatDecimal(currentPosition.tradingFee ?? 0)}`}</ListItem>
        <ListItem
          label={dict.swap}
        >{`$${formatDecimal(currentPosition.overNightFee ?? 0)}`}</ListItem>
        <ListItem
          label={dict.openTime}
        >{`${dayjs(currentPosition.createTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
        <ListItem label={dict.id}>{`${currentPosition.orderSn}`}</ListItem>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <XStack ai="center" jc="space-between">
        <XStack ai="center" gap="$sm">
          <Text
            fos={17}
            lh={20}
            fow="900"
            col={currentPosition?.openSafe === 0 ? "$primary" : "$destructive"}
          >
            {t(
              currentPosition?.openSafe === 0
                ? "positions.buy"
                : "positions.sell"
            )}
          </Text>
          <Text fos={17} lh={20} fow="900">
            {currentPosition.futuresCode}
          </Text>
        </XStack>
        <Text
          fos={17}
          lh={20}
          fow="900"
          col={currentPosition.profit! > 0 ? "$primary" : "$destructive"}
        >
          {`$${currentPosition.profit! > 0 ? "+" : ""}${formatDecimal(
            currentPosition.profit ?? 0,
            currentPosition.volatility
          )}`}
        </Text>
      </XStack>
      <XStack ai="center" jc="space-between" py="$md" bbc="$border" bbw={1}>
        <Text col="$secondary">{data?.futures?.futuresName}</Text>
        <XStack gap="$sm" ai="center">
          <XStack ai="center" gap="$xs" jc="center">
            <Text ff="$mono">
              {formatDecimal(
                currentPosition.price ?? 0,
                currentPosition.volatility
              )}
            </Text>
            <XStack rotate="180deg">
              <Icon name="arrowLeft" color={colors.text} size={12} />
            </XStack>
            <Text ff="$mono">
              {formatDecimal(
                currentPosition.overPrice ?? 0,
                currentPosition.volatility
              )}
            </Text>
          </XStack>
        </XStack>
      </XStack>
      <ListItem label={dict.volume}>{`${currentPosition.position}`}</ListItem>
      <ListItem
        label={dict.margin}
      >{`$${formatDecimal(currentPosition.securityDeposit ?? 0)}`}</ListItem>
      <ListItem
        label={dict.commission}
      >{`$${formatDecimal(currentPosition.tradingFee ?? 0)}`}</ListItem>
      <ListItem
        label={dict.swap}
      >{`$${formatDecimal(currentPosition.overNightFee ?? 0)}`}</ListItem>
      <ListItem
        label={dict.openTime}
      >{`${dayjs(currentPosition.createTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
      <ListItem
        label={dict.closeTime}
      >{`${dayjs(currentPosition.overTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
      <ListItem label={t("trade.closeLoss")}>
        {currentPosition.stopLossPrice
          ? `$${formatDecimal(currentPosition.stopLossPrice, currentPosition.volatility)}`
          : "-"}
      </ListItem>
      <ListItem label={t("trade.closeProfit")}>
        {currentPosition.stopProfitPrice
          ? `$${formatDecimal(currentPosition.stopProfitPrice, currentPosition.volatility)}`
          : "-"}
      </ListItem>
      <ListItem label={dict.id}>{`${currentPosition.orderSn}`}</ListItem>
    </Fragment>
  )
}
