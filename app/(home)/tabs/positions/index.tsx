import { useUnmount } from 'ahooks'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import Animated from 'react-native-reanimated'
import { shallow } from 'zustand/shallow'

import { Tabs, Text, XStack, YStack } from '~/components'
import { useOrderStore } from '~/hooks/useStore'
import { useTabs } from '~/hooks/useTabs'
import { DEVICE_WIDTH } from '~/lib/utils'
import { ClosePosition } from '~/widgets/(home)/tabs/positions/close-position'
import { OrderFilter } from '~/widgets/(home)/tabs/positions/order-filter'
import {
  ClosedOrders, OpenOrders, PendingOrders
} from '~/widgets/(home)/tabs/positions/position-list'
import { Linear } from '~/widgets/shared/shape'
import { WalletStatistics } from '~/widgets/shared/wallet-summary'

export default function Page() {
  const { t } = useTranslation()
  const {
    pendingOrders,
    orders,
    activeIndex = 0,
  } = useOrderStore(
    (state) => ({
      pendingOrders: state.pendingOrders?.length,
      orders: state.orders?.length,
      activeIndex: state.activeIndex,
    }),
    shallow
  )

  const dict = t("positions", {
    returnObjects: true,
  })

  useUnmount(() => {
    useOrderStore.setState({ activeIndex: 0 })
  })
  const { animatedStyle } = useTabs(activeIndex)
  return (
    <Fragment>
      <YStack f={1}>
        <Linear />
        <WalletStatistics />
        <YStack f={1} w={DEVICE_WIDTH}>
          <XStack p="$md" ai="center" jc="space-between">
            <Text subject bold>
              {dict.title}
            </Text>
            {activeIndex === 2 ? <OrderFilter /> : null}
          </XStack>
          <XStack px="$md" bbw={1} bbc="$border">
            <Tabs
              data={[
                `${dict.tabs[0]} ${orders ? `(${orders})` : ""}`,
                `${dict.tabs[1]} ${pendingOrders ? `(${pendingOrders})` : ""}`,
                dict.tabs[2],
              ]}
              activeIndex={activeIndex}
              onChange={(index) =>
                useOrderStore.setState({ activeIndex: index as 0 | 1 | 2 })
              }
            ></Tabs>
          </XStack>
          <Animated.View style={[{ flex: 1, flexDirection: 'row', width: DEVICE_WIDTH * 3 }, animatedStyle]}>
            <OpenOrders />
            <PendingOrders />
            <ClosedOrders />
          </Animated.View>
        </YStack>
      </YStack>
      <ClosePosition activeIndex={activeIndex} />
    </Fragment>
  )
}
