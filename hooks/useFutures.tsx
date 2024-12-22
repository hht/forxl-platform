import { useEffect } from "react"
import { shallow } from "zustand/shallow"

import { useQuotesStore, useSymbolStore } from "./useStore"

export const useFutureMutation = (
  mutate: (v: { futuresId: number; selected: 0 | 1 }) => void
) => {
  const { mutationFuture } = useSymbolStore((state) => state, shallow)
  useEffect(() => {
    if (mutationFuture) {
      mutate(mutationFuture)
      if (
        useQuotesStore.getState().currentFuture?.futuresId ===
        mutationFuture.futuresId
      ) {
        useQuotesStore.setState({
          currentFuture: {
            ...useQuotesStore.getState().currentFuture,
            selected: mutationFuture.selected,
          },
        })
      }
    }
  }, [mutationFuture, mutate])
}

export const onToggleFavorite = (futuresId: number, selected: 0 | 1) => {
  useSymbolStore.setState({
    mutationFuture: {
      futuresId: futuresId!,
      selected: selected,
    },
  })
  const currentFuture = useSymbolStore.getState().currentFuture
  if (currentFuture) {
    useSymbolStore.setState({
      currentFuture: {
        ...currentFuture,
        selectCount: currentFuture.selectCount + (selected ? 1 : -1),
      },
    })
  }
}
