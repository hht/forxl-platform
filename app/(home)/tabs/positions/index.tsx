import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { ScrollView, Tabs, Text, XStack, YStack } from '~/components'
import { useOrderStore } from '~/hooks/useStore'
import { DEVICE_WIDTH } from '~/lib/utils'
import { ClosePosition } from '~/widgets/(home)/tabs/positions/close-position'
import { ClosedOrders, OpenOrders, PendingOrders } from '~/widgets/(home)/tabs/positions/list'
import { Linear } from '~/widgets/shared/shape'
import { WalletStatistics } from '~/widgets/shared/wallet-summary'

export default function Page() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const { pendingOrders, orders } = useOrderStore(
    (state) => ({
      pendingOrders: state.pendingOrders?.length ?? 0,
      orders: state.orders?.length ?? 0,
    }),
    shallow
  )

  const dict = t("positions", {
    returnObjects: true,
  })
  const ref = useRef<ScrollView>(null)
  useEffect(() => {
    ref.current?.scrollTo({
      x: activeIndex * DEVICE_WIDTH,
      y: 0,
      animated: true,
    })
  }, [activeIndex])
  return (
    <Fragment>
      <YStack f={1}>
        <Linear />
        <WalletStatistics />
        <YStack f={1}>
          <Text subject m="$md">
            {dict.title}
          </Text>
          <XStack px="$md">
            <Tabs
              data={[
                `${dict.tabs[0]} ${orders ? `(${orders})` : ""}`,
                `${dict.tabs[1]} ${pendingOrders ? `(${pendingOrders})` : ""}`,
                dict.tabs[2],
              ]}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            ></Tabs>
          </XStack>
          <ScrollView
            ref={ref}
            horizontal
            f={1}
            pagingEnabled
            scrollEnabled={false}
          >
            <OpenOrders />
            <PendingOrders />
            <ClosedOrders />
          </ScrollView>
        </YStack>
      </YStack>
      <ClosePosition activeIndex={activeIndex} />
    </Fragment>
  )
}
