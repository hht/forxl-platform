import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { AnimatedFlow, Text, XStack, YStack } from "~/components"
import { useQuotesStore, useSymbolStore } from "~/hooks/useStore"

export const CurrentPrice = () => {
  const { t } = useTranslation()
  const price = useQuotesStore((state) => state.getCurrentPrice(), shallow)
  const volatility = useQuotesStore(
    (state) => state.currentFuture?.volatility,
    shallow
  )
  return (
    <YStack gap="$xs" ai="center" jc="space-between">
      {price ? (
        <AnimatedFlow
          fontSize={17}
          value={price}
          fraction={volatility}
          fow="bold"
          col="$text"
        />
      ) : (
        <Text>-</Text>
      )}
      <Text col="$secondary" fos={11}>
        {t("trade.currentPrice")}
      </Text>
    </YStack>
  )
}

export const Action = () => {
  const { t } = useTranslation()
  const action = useQuotesStore((state) => state.action, shallow)
  const isBuy = action === "buy"
  return (
    <XStack
      ai="center"
      boc="$border"
      h={30}
      w={120}
      bw={1}
      br="$sm"
      ov="hidden"
    >
      <Text
        col={isBuy ? "$background" : "$secondary"}
        f={1}
        lh={28}
        ta="center"
        h="100%"
        bc={isBuy ? "$primary" : "transparent"}
        onPress={() => {
          useQuotesStore.setState({ action: "buy" })
        }}
      >
        {t("trade.buy")}
      </Text>
      <Text
        f={1}
        h="100%"
        lh={28}
        ta="center"
        col={isBuy ? "$secondary" : "$background"}
        bc={isBuy ? "transparent" : "$destructive"}
        onPress={() => {
          useQuotesStore.setState({ action: "sell" })
        }}
      >
        {t("trade.sell")}
      </Text>
    </XStack>
  )
}
