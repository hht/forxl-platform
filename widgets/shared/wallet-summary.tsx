import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useIsFocused } from "@react-navigation/native"
import { router } from "expo-router"
import { AnimatePresence, useAnimationState } from "moti"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

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
import { usePromptStore, useStatisticsStore } from "~/hooks/useStore"
import { formatDecimal, uuid } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

const ListItem: FC<{ label: string; value: number; onPress: () => void }> = ({
  label,
  value,
  onPress,
}) => {
  return (
    <YStack gap="$xs" f={1} ai="center" jc="center" h="100%" onPress={onPress}>
      <XStack pb="$xs" ov="hidden">
        <Text caption col="$secondary">
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

const Summary: FC<{
  onChange: (v: { title: string; desc: string[]; reloadKey: string }) => void
}> = ({ onChange }) => {
  const { t } = useTranslation()
  const { available, totalMoney, freezeMoney, supFreezeMoney } =
    useStatisticsStore((state) => state, shallow)
  return (
    <XStack fd="row" h="100%" w="100%" ai="center">
      <ListItem
        label={t("wallet.balance")}
        value={available}
        onPress={() => {
          onChange({
            title: t("wallet.balance"),
            desc: t("wallet.balanceDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("wallet.equity")}
        value={totalMoney}
        onPress={() => {
          usePromptStore.setState({
            title: t("wallet.equity"),
            desc: t("wallet.equityDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("wallet.freeMargin")}
        value={freezeMoney}
        onPress={() => {
          usePromptStore.setState({
            title: t("wallet.freeMargin"),
            desc: t("wallet.marginDesc", {
              returnObjects: true,
            }),
            reloadKey: uuid(),
          })
        }}
      />
      <Separator orientation="vertical" h="50%" />
      <ListItem
        label={t("wallet.freeMargin")}
        value={supFreezeMoney}
        onPress={() => {
          usePromptStore.setState({
            title: t("wallet.freeMargin"),
            desc: t("wallet.freeMarginDesc", {
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
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"
  const { top, bottom } = useSafeAreaInsets()
  const profit = useStatisticsStore((state) => state.profit, shallow)
  const [{ title, desc, reloadKey }, setState] = useState<{
    title?: string
    desc?: string[]
    reloadKey?: string
  }>({})
  const ref = useRef<BottomSheetModal>(null)
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
  const { t } = useTranslation()
  useEffect(() => {
    if (reloadKey && title) {
      ref.current?.present()
    }
  }, [reloadKey, title])

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
            <Text col={color} bold>
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
              <Summary onChange={setState} />
            </Moti>
          ) : null}
        </AnimatePresence>
      </YStack>
      {title ? (
        <BottomSheet ref={ref} index={0} title={title}>
          <YStack gap="$lg" px="$md" pb={bottom + 16}>
            {desc?.map((item, index) => (
              <Text key={index} col="$text" fos={15} lh={20}>
                {item}
              </Text>
            ))}
            <YStack ai="center">
              {title ? <AnimatedDescription current="balance" /> : null}
            </YStack>
            <Button
              onPress={() => {
                ref.current?.dismiss()
                router.push("/deposit")
              }}
            >
              {t("wallet.addFunds")}
            </Button>
          </YStack>
        </BottomSheet>
      ) : null}
    </Fragment>
  )
}
