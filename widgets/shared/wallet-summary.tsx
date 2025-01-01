import { AnimatePresence, useAnimationState } from "moti"
import { FC, Fragment, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import { Notifier } from "./header"

import {
  AnimatedFlow,
  Icon,
  Moti,
  Separator,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useOrderStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

const ListItem: FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <YStack gap="$xs" f={1} ai="center" jc="center" h="100%">
      <XStack pb="$xs" ov="hidden">
        <Text fos={11} col="$secondary">
          {label}
        </Text>
        <XStack
          pos="absolute"
          l={0}
          r={0}
          b={-1}
          boc="$secondary"
          bw={1}
          bs="dashed"
        ></XStack>
      </XStack>
      <AnimatedFlow value={value} addonsBefore={`$`} />
    </YStack>
  )
}

const Summary: FC = () => {
  const { t } = useTranslation()
  const { available, totalMoney, freezeMoney, supFreezeMoney } = useOrderStore(
    (state) => state.summary,
    shallow
  )
  return (
    <XStack fd="row" h="100%" w="100%" ai="center">
      <ListItem label={t("trade.balance")} value={available} />
      <Separator orientation="vertical" h="50%" />
      <ListItem label={t("trade.equity")} value={totalMoney} />
      <Separator orientation="vertical" h="50%" />
      <ListItem label={t("trade.margin")} value={freezeMoney} />
      <Separator orientation="vertical" h="50%" />
      <ListItem label={t("trade.freeMargin")} value={supFreezeMoney} />
    </XStack>
  )
}

export const WalletStatistics: FC = () => {
  const [visible, setVisible] = useState(false)
  const { top } = useSafeAreaInsets()
  const profit = useOrderStore((state) => state.summary.profit, shallow)
  const state = useAnimationState({
    from: {
      rotate: "90deg",
    },
    collapse: {
      rotate: "90deg",
    },
    expand: {
      rotate: "-90deg",
    },
  })
  useEffect(() => {
    if (visible) {
      state.transitionTo("expand")
    } else {
      state.transitionTo("collapse")
    }
  }, [visible, state])
  const color = profit > 0 ? colors.primary : colors.destructive
  return (
    <Fragment>
      <YStack pt={top} ov="hidden">
        <XStack ai="center" jc="center" gap="$sm" w="100%" zi={10} h={50}>
          <XStack
            bc={toRGBA(color, 0.1)}
            br="$lg"
            ai="center"
            jc="center"
            gap="$xs"
            px="$md"
            py={6}
            onPress={() => setVisible((v) => !v)}
          >
            <Text col={color} fow="900">
              {`$${formatDecimal(profit)}`}
            </Text>
            <Moti state={state}>
              <Icon name="chevronRight" color={color} size={14} />
            </Moti>
          </XStack>
          <XStack pos="absolute" r="$sm" h="100%" ai="center" pr="$md">
            <Notifier icon="ring" type={1} />
          </XStack>
        </XStack>
        <AnimatePresence>
          {visible ? (
            <Moti
              from={{ opacity: 0, translateY: -20, height: 0 }}
              animate={{ opacity: 1, translateY: 0, height: 64 }}
              exit={{ opacity: 0, translateY: -20, height: 0 }}
              transition={{ type: "timing", duration: 200 }}
            >
              <Summary />
            </Moti>
          ) : null}
        </AnimatePresence>
      </YStack>
    </Fragment>
  )
}
