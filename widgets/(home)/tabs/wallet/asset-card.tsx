import BottomSheetBase from '@gorhom/bottom-sheet'
import { FC, Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import {
    AnimatedFlow, BottomSheet, Card, Icon, ScrollView, Text, XStack, YStack
} from '~/components'
import { useStatisticsStore } from '~/hooks/useStore'
import { DEVICE_HEIGHT } from '~/lib/utils'

export const AssetCard: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("wallet.equityDesc", {
    returnObjects: true,
  })
  const { available, totalMoney, supFreezeMoney } = useStatisticsStore(
    (state) => ({
      available: state?.available,
      totalMoney: state?.totalMoney,
      supFreezeMoney: state?.supFreezeMoney,
    }),
    shallow
  )
  const ref = useRef<BottomSheetBase>(null)
  return (
    <Fragment>
      <Card fd="row" ai="center">
        <YStack gap="$sm" f={1}>
          <XStack ai="center" jc="space-between">
            <Text col="$secondary">{t("trade.equity")}</Text>
            <XStack hitSlop={16} onPress={() => ref.current?.expand()}>
              <Icon name="info" size={20} />
            </XStack>
          </XStack>
          <AnimatedFlow
            addonsBefore="$"
            value={totalMoney}
            fos={28}
            lh={32}
            fow="bold"
            col="$text"
          />
          <XStack py="$xs" ai="center" jc="space-between">
            <Text col="$secondary">{t("trade.balance")}</Text>
            <AnimatedFlow col="$text" addonsBefore="$" value={available} />
          </XStack>
          <XStack ai="center" jc="space-between">
            <Text col="$secondary">{t("trade.freeMargin")}</Text>
            <AnimatedFlow col="$text" addonsBefore="$" value={supFreezeMoney} />
          </XStack>
        </YStack>
      </Card>
      <BottomSheet
        title={dict.title}
        ref={ref}
        // eslint-disable-next-line react-compiler/react-compiler
        onClose={ref.current?.close}
        maxDynamicContentSize={DEVICE_HEIGHT * 0.9}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack px="$md" pb={bottom + 16} gap="$md">
            {dict.children.map((item, index) => (
              <YStack gap="$sm" key={index}>
                <Text fos={17} fow="bold">
                  {item.title}
                </Text>
                <Text>{item.desc}</Text>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </BottomSheet>
    </Fragment>
  )
}
