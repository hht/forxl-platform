import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { getFuture } from "~/api/trade"
import { Icon, Text, XStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useOrderStore } from "~/hooks/useStore"
import { dayjs, formatCurrency, formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"
import { ListItem } from "~/widgets/(home)/position/list-item"
import { PriceCell } from "~/widgets/shared/price-cell"
import { ProfitCell } from "~/widgets/shared/profit-cell"

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
              {currentPosition.futuresCode}
            </Text>
          </XStack>
          <ProfitCell data={currentPosition} fos={17} lh={20} fow="bold" />
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
        <ListItem
          label={t("trade.volume")}
        >{`${currentPosition.position}`}</ListItem>
        <ListItem label={t("wallet.margin")}>
          {formatCurrency(currentPosition.securityDeposit ?? 0)}
        </ListItem>
        <ListItem label={t("trade.commission")}>
          {formatCurrency(currentPosition.tradingFee ?? 0)}
        </ListItem>
        <ListItem label={dict.swap}>
          {formatCurrency(currentPosition.overNightFee ?? 0)}
        </ListItem>
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
            heading
            bold
            col={currentPosition?.openSafe === 0 ? "$primary" : "$destructive"}
          >
            {t(currentPosition?.openSafe === 0 ? "trade.buy" : "trade.sell")}
          </Text>
          <Text heading bold>
            {currentPosition.futuresCode}
          </Text>
        </XStack>
        <Text
          heading
          bold
          col={currentPosition.profit! > 0 ? "$primary" : "$destructive"}
        >
          {`${currentPosition.profit! > 0 ? "+" : ""}${formatCurrency(
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
      <ListItem
        label={t("trade.volume")}
      >{`${currentPosition.position}`}</ListItem>
      <ListItem label={t("wallet.margin")}>
        {formatCurrency(currentPosition.securityDeposit ?? 0)}
      </ListItem>
      <ListItem label={t("trade.commission")}>
        {formatCurrency(currentPosition.tradingFee ?? 0)}
      </ListItem>
      <ListItem label={dict.swap}>
        {formatCurrency(currentPosition.overNightFee ?? 0)}
      </ListItem>
      <ListItem
        label={dict.openTime}
      >{`${dayjs(currentPosition.createTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
      <ListItem
        label={dict.closeTime}
      >{`${dayjs(currentPosition.overTime).format("MMM DD, YYYY HH:mm")}`}</ListItem>
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
