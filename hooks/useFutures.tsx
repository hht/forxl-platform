import { useEffect } from "react"
import { shallow } from "zustand/shallow"

import { useQuotesStore, useSymbolStore } from "./useStore"

export const onToggleFavorite = (futuresId: number, selected: 0 | 1) => {
  useSymbolStore.setState({
    mutationFuture: {
      futuresId: futuresId!,
      selected: selected,
    },
  })
}
