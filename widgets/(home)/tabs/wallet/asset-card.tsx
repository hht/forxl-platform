import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { FC, Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import { AnimatedFlow, BottomSheet, Card, Icon, Text, XStack, YStack } from '~/components'
import { useStatisticsStore } from '~/hooks/useStore'
import { DEVICE_HEIGHT } from '~/lib/utils'
import colors from '~/theme/colors'

export const AssetCard: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("wallet.assetDesc", {
    returnObjects: true,
  })
  const { supMoney, totalMoney, supFreezeMoney } = useStatisticsStore(
    (state) => ({
      supMoney: state?.supMoney,
      totalMoney: state?.totalMoney,
      supFreezeMoney: state?.supFreezeMoney,
    }),
    shallow
  )
  const ref = useRef<BottomSheetModal>(null)
  return (
    <Fragment>
      <Card fd="row" ai="center">
        <YStack gap="$sm" f={1}>
          <XStack ai="center" jc="space-between">
            <Text col="$secondary">{t("wallet.equity")}</Text>
            <XStack hitSlop={16} onPress={() => ref.current?.present()}>
              <Icon name="info" size={20} />
            </XStack>
          </XStack>
          <AnimatedFlow
            addonsBefore="$"
            value={totalMoney}
            fontSize={28}
            bold
            color={colors.text}
          />
          <XStack py="$xs" ai="center" jc="space-between">
            <Text col="$secondary">{t("wallet.balance")}</Text>
            <AnimatedFlow
              color={colors.text}
              addonsBefore="$"
              value={supMoney}
            />
          </XStack>
          <XStack ai="center" jc="space-between">
            <Text col="$secondary">{t("wallet.freeMargin")}</Text>
            <AnimatedFlow
              color={colors.text}
              addonsBefore="$"
              value={supFreezeMoney}
            />
          </XStack>
        </YStack>
      </Card>
      <BottomSheet
        title={dict.title}
        ref={ref}
        maxDynamicContentSize={DEVICE_HEIGHT * 0.9}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack px="$md" pb={bottom + 16} gap="$md">
            {dict.children.map((item, index) => (
              <YStack gap="$sm" key={index}>
                <Text heading bold>
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
