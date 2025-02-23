import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { getFuture } from '~/api/trade'
import { Icon, Row, Text, XStack } from '~/components'
import { getDate } from '~/hooks/useLocale'
import { useRequest } from '~/hooks/useRequest'
import { useOrderStore } from '~/hooks/useStore'
import { formatCurrency, formatDecimal, formatProfit } from '~/lib/utils'
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
              heading
              bold
              col={
                currentPosition?.openSafe === 0 ? "$primary" : "$destructive"
              }
            >
              {t(currentPosition?.openSafe === 0 ? "trade.buy" : "trade.sell")}
            </Text>
            <Text heading bold>
              {currentPosition.futuresShow}
            </Text>
          </XStack>
          {activeIndex === 1 ? <Row gap="$sm">
            <Text col="$secondary">-</Text>
            <Text col="$secondary">-</Text>
          </Row> : <ProfitCell data={currentPosition} fontSize={17} bold />}
        </XStack>
        <XStack ai="center" jc="space-between" py="$md" bbc="$border" bbw={1}>
          <Text col="$secondary">{data?.futures?.futuresName}</Text>
          <XStack gap="$sm" ai="center">
            <XStack ai="center" gap="$xs" jc="center">
              <Text>
                {formatDecimal(
                  currentPosition.price ?? 0,
                  currentPosition.volatility
                )}
              </Text>
              <XStack rotate="180deg">
                <Icon name="arrowLeft" color={colors.text} size={12} />
              </XStack>
              <PriceCell data={currentPosition} color={colors.text} />
            </XStack>
          </XStack>
        </XStack>
        <ListItem
          label={t("trade.volume")}
        >{`${currentPosition.position}`}</ListItem>
        <ListItem label={t("wallet.margin")}>
          {formatCurrency(currentPosition.securityDeposit ?? 0)}
        </ListItem>
        <ListItem label={t("trade.commission")}>
          {activeIndex === 1
            ? "-"
            : formatCurrency(currentPosition.tradingFee ?? 0)}
        </ListItem>
        <ListItem label={dict.swap}>
          {activeIndex === 1
            ? "-"
            : formatCurrency(currentPosition.overNightFee ?? 0)}
        </ListItem>
        <ListItem
          label={dict.openTime}
        >{`${getDate(currentPosition.createTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
        <ListItem label={dict.id}>{`${currentPosition.orderSn}`}</ListItem>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <XStack ai="center" jc="space-between">
        <XStack ai="center" gap="$sm">
          <Text
            heading
            bold
            col={currentPosition?.openSafe === 0 ? "$primary" : "$destructive"}
          >
            {t(currentPosition?.openSafe === 0 ? "trade.buy" : "trade.sell")}
          </Text>
          <Text heading bold>
            {currentPosition.futuresShow}
          </Text>
        </XStack>
        {currentPosition.cancelTime ? (
          <Text heading bold col="$secondary">
            -
          </Text>
        ) : (
          <Row ai="baseline" gap="$xs">
            <Text
              heading
              bold
              col={
                (currentPosition.pureProfit ??
                  currentPosition.priceProfit ??
                  0) > 0
                  ? "$primary"
                  : (currentPosition.pureProfit ??
                    currentPosition.priceProfit! < 0)
                    ? "$destructive"
                    : "$secondary"
              }
            >
              {formatProfit(
                currentPosition.pureProfit ?? currentPosition.priceProfit ?? 0
              )}
            </Text>
            <Text
              fos={14}
              lh={14}
              bold
              col={
                (currentPosition.pureProfit ??
                  currentPosition.priceProfit ??
                  0) > 0
                  ? "$primary"
                  : (currentPosition.pureProfit ??
                    currentPosition.priceProfit!) < 0
                    ? "$destructive"
                    : "$secondary"
              }
            >
              {formatDecimal(
                ((currentPosition.pureProfit ??
                  currentPosition.priceProfit ??
                  0) /
                  (currentPosition.securityDeposit ?? 1)) *
                100
              )}
              %
            </Text>
          </Row>
        )}
      </XStack>
      <XStack ai="center" jc="space-between" py="$md" bbc="$border" bbw={1}>
        <Text col="$secondary">{data?.futures?.futuresName}</Text>
        <XStack gap="$sm" ai="center">
          <XStack ai="center" gap="$xs" jc="center">
            <Text>
              {formatDecimal(
                currentPosition.price ?? 0,
                currentPosition.volatility
              )}
            </Text>
            <XStack rotate="180deg">
              <Icon name="arrowLeft" color={colors.text} size={12} />
            </XStack>
            <Text>
              {formatDecimal(
                currentPosition.overPrice ?? 0,
                currentPosition.volatility
              )}
            </Text>
          </XStack>
        </XStack>
      </XStack>
      <ListItem
        label={t("trade.volume")}
      >{`${currentPosition.position}`}</ListItem>
      <ListItem label={t("wallet.margin")}>
        {formatCurrency(currentPosition.securityDeposit ?? 0)}
      </ListItem>
      <ListItem label={t("trade.commission")}>
        {currentPosition.cancelTime
          ? "-"
          : formatCurrency(currentPosition.tradingFee ?? 0)}
      </ListItem>
      <ListItem label={dict.swap}>
        {currentPosition.cancelTime
          ? "-"
          : formatCurrency(currentPosition.overNightFee ?? 0)}
      </ListItem>
      <ListItem
        label={dict.openTime}
      >{`${getDate(currentPosition.createTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
      <ListItem
        label={dict.closeTime}
      >{`${getDate(currentPosition.overTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
      <ListItem label={t("trade.closeAtLoss")}>
        {currentPosition.stopLossPrice
          ? formatCurrency(
            currentPosition.stopLossPrice,
            currentPosition.volatility
          )
          : "-"}
      </ListItem>
      <ListItem label={t("trade.closeAtProfit")}>
        {currentPosition.stopProfitPrice
          ? formatCurrency(
            currentPosition.stopProfitPrice,
            currentPosition.volatility
          )
          : "-"}
      </ListItem>
      <ListItem label={dict.id}>{`${currentPosition.orderSn}`}</ListItem>
    </Fragment>
  )
}
