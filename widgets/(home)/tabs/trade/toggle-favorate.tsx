import { clearCache } from "ahooks"
import { ActivityIndicator } from "react-native"
import { shallow } from "zustand/shallow"

import { toggleFavorite } from "~/api/trade"
import { Icon, XStack } from "~/components"
import { onToggleFavorite } from "~/hooks/useFutures"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useQuotesStore } from "~/hooks/useStore"

export const ToggleFavorite = () => {
  const currentFuture = useQuotesStore((state) => state.currentFuture, shallow)
  const { run, loading } = useRequest(toggleFavorite, {
    manual: true,
    onSuccess: () => {
      const currentFuture = useQuotesStore.getState().currentFuture
      useQuotesStore.setState({
        currentFuture: {
          ...currentFuture,
          selected: currentFuture?.selected ? 0 : 1,
        },
      })
      onToggleFavorite(
        currentFuture?.futuresId!,
        currentFuture?.selected ? 0 : 1
      )
      clearCache(CACHE_KEY.FUTURE_CATEGORIES)
    },
  })
  return (
    <XStack
      hitSlop={16}
      onPress={() => {
        run({
          futuresId: currentFuture?.futuresId!,
          selected: currentFuture?.selected ?? 1,
        })
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Icon
          name={currentFuture?.selected ? "starFilled" : "star"}
          size={20}
        />
      )}
    </XStack>
  )
}
