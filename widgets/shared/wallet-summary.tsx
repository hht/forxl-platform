import BottomSheetBase from "@gorhom/bottom-sheet"
import { useIsFocused } from "@react-navigation/native"
import { AnimatePresence, useAnimationState } from "moti"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { Notifier } from "./header"

import {
  AnimatedFlow,
  BottomSheet,
  Button,
  Icon,
  Moti,
  Separator,
  Text,
  XStack,
  YStack,
} from "~/components"
import { useStatisticsStore } from "~/hooks/useStore"
import { formatDecimal, t, uuid } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

const ListItem: FC<{ label: string; value: number; onPress: () => void }> = ({
  label,
  value,
  onPress,
}) => {
  return (
    <YStack gap="$xs" f={1} ai="center" jc="center" h="100%" onPress={onPress}>
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

const useStore = createWithEqualityFn<{
  current?: "balance" | "equity" | "margin" | "freeMargin"
  title?: string
  desc?: string[]
  reloadKey?: string
}>()((set) => ({}))

const AnimatedDescription: FC<{ current: string }> = ({ current }) => {
  const it = useStatisticsStore((state) => {
    switch (current) {
      case "balance":
        return state.available
      case "equity":
        return state.totalMoney
      case "margin":
        return state.freezeMoney
      case "freeMargin":
        return state.supFreezeMoney
      default:
        return 0
    }
  }, shallow)
  return (
    <AnimatedFlow
      addonsBefore="$"
      value={it}
      fos={28}
      lh={36}
      col="$text"
    ></AnimatedFlow>
  )
}

const Summary: FC<{ onPress: (v: string) => void }> = ({ onPress }) => {
  const { t } = useTranslation()
  const { available, totalMoney, freezeMoney, supFreezeMoney } =
    useStatisticsStore((state) => state, shallow)
  return (
    <XStack fd="row" h="100%" w="100%" ai="center">
      <ListItem
        label={t("trade.balance")}
        value={available}
        onPress={() => {
          onPress("balance")
          useStore.setState({
            current: "balance",
            title: t("trade.balance"),
            desc: t("trade.balanceDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("trade.equity")}
        value={totalMoney}
        onPress={() => {
          onPress("equity")
          useStore.setState({
            current: "equity",
            title: t("trade.equity"),
            desc: t("trade.equityDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("trade.margin")}
        value={freezeMoney}
        onPress={() => {
          onPress("margin")
          useStore.setState({
            current: "margin",
            title: t("trade.margin"),
            desc: t("trade.marginDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("trade.freeMargin")}
        value={supFreezeMoney}
        onPress={() => {
          onPress("freeMargin")
          useStore.setState({
            current: "freeMargin",
            title: t("trade.freeMargin"),
            desc: t("trade.freeMarginDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
    </XStack>
  )
}

export const WalletStatistics: FC = () => {
  const { top, bottom } = useSafeAreaInsets()
  const profit = useStatisticsStore((state) => state.profit, shallow)
  const { title, desc, reloadKey } = useStore((state) => state)
  const [current, setCurrent] = useState<string | undefined>(undefined)
  const ref = useRef<BottomSheetBase>(null)
  const [visible, setVisible] = useState(false)
  const state = useAnimationState(
    {
      from: {
        rotate: "90deg",
      },
      collapse: {
        rotate: "90deg",
      },
      expand: {
        rotate: "-90deg",
      },
    },
    {
      from: visible ? "expand" : "collapse",
    }
  )
  const color = profit > 0 ? colors.primary : colors.destructive
  const isFocused = useIsFocused()
  useEffect(() => {
    if (reloadKey && current && isFocused) {
      ref.current?.expand()
    }
  }, [reloadKey, current, isFocused])

  useEffect(() => {
    if (visible) {
      state.transitionTo("expand")
    } else {
      state.transitionTo("collapse")
    }
  }, [visible, state])
  useEffect(() => {
    if (isFocused && visible) {
      state.transitionTo("expand")
    }
  }, [isFocused, visible, state])
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
            onPress={() => {
              setVisible((v) => !v)
            }}
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
              <Summary onPress={(v: string) => setCurrent(v)} />
            </Moti>
          ) : null}
        </AnimatePresence>
      </YStack>
      {current ? (
        <BottomSheet
          ref={ref}
          index={0}
          title={title}
          onChange={(index) => {
            if (index === -1) {
              {
                setCurrent(undefined)
              }
            }
          }}
        >
          <YStack gap="$lg" px="$md" pb={bottom + 16}>
            {desc?.map((item, index) => (
              <Text key={index} col="$text" fos={15} lh={20}>
                {item}
              </Text>
            ))}
            <YStack ai="center">
              {current ? <AnimatedDescription current={current} /> : null}
            </YStack>
            {current === "balance" ? (
              <Button>{t("wallet.addFunds")}</Button>
            ) : null}
          </YStack>
        </BottomSheet>
      ) : null}
    </Fragment>
  )
}
