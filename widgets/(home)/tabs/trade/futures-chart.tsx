import { AnimatePresence } from "moti"
import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import { shallow } from "zustand/shallow"

import { Icon, Moti, Text, XStack, YStack } from "~/components"
import { useSymbolStore } from "~/hooks/useStore"
import FutureChart from "~/widgets/shared/future-chart"

export const FuturesChart: FC = () => {
  const currentCode = useSymbolStore((state) => state.currentCode, shallow)
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (!currentCode) {
      setVisible(false)
    }
  }, [currentCode])
  return (
    <AnimatePresence>
      {currentCode && (
        <Moti
          key="bar"
          from={{
            translateY: 400,
          }}
          animate={{
            translateY: 0,
          }}
          exit={{
            translateY: 400,
          }}
          transition={{
            type: "timing",
          }}
          style={style.container}
        >
          <XStack
            p="$md"
            bc="$background"
            btc="$border"
            btw={1}
            ai="center"
            jc="space-between"
          >
            <Text>{`${currentCode} ${t("trade.chart")}`}</Text>
            <XStack
              rotate={visible ? "90deg" : "270deg"}
              hitSlop={16}
              onPress={() => {
                setVisible((v) => !visible)
              }}
            >
              <Icon name="chevronRight" size={16}></Icon>
            </XStack>
          </XStack>
          <AnimatePresence>
            {currentCode && visible && (
              <Moti
                key="body"
                from={{ height: 0 }}
                animate={{ height: 260 }}
                exit={{ height: 0 }}
                transition={{
                  type: "timing",
                }}
              >
                <YStack h="100%" bc="$primary" w="100%"></YStack>
              </Moti>
            )}
          </AnimatePresence>
        </Moti>
      )}
    </AnimatePresence>
  )
}

const style = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
})
