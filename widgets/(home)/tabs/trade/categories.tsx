import BottomSheetBase from "@gorhom/bottom-sheet"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { shallow } from "zustand/shallow"

import { getFutureCategories } from "~/api/trade"
import { BottomSheet, Icon, IconType, Text, XStack, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useSymbolStore } from "~/hooks/useStore"
import colors from "~/theme/colors"

const getItemIcon = (
  data: Awaited<ReturnType<typeof getFutureCategories>>[number]
): IconType => {
  switch (data.type) {
    case "":
      if (data.isSelect) {
        return "star"
      }
      return "popular"
    case "FOREX":
      return "forex"
    case "DIGICCY":
      return "crypto"
    case "SHARES":
      return "indices"
    case "US_EQUITY":
    case "HK_EQUITY":
    case "UK_EQUITY":
    case "EU_EQUITY":
    case "AU_EQUITY":
      return "stocks"
    case "OILFUT":
    case "COMMODITY":
      return "metals"
    case "BASKETS":
      return "energies"
    default:
      return "stocks"
  }
}

const ListItem: FC<{
  data: Awaited<ReturnType<typeof getFutureCategories>>[number]
}> = ({ data }) => {
  const currentFuture = useSymbolStore((state) => state.currentFuture, shallow)
  const active = currentFuture?.name === data.name
  return (
    <XStack
      p="$md"
      gap="$sm"
      ai="center"
      onPress={() => {
        useSymbolStore.setState({ currentFuture: data })
      }}
    >
      <Icon name={getItemIcon(data)} size={20}></Icon>
      <Text fos={15} f={1} lh={20} col={active ? colors.primary : colors.text}>
        {data.name}
      </Text>
      {currentFuture?.name === data.name ? (
        <Icon name="checked" color={colors.primary} size={20}></Icon>
      ) : null}
    </XStack>
  )
}

export const FutureCategories: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const currentFuture = useSymbolStore((state) => state.currentFuture, shallow)
  const [visible, setVisible] = useState(false)
  const { data } = useRequest(getFutureCategories, {
    cacheKey: CACHE_KEY.FUTURE_CATEGORIES,
    staleTime: 1000 * 60 * 60,
    onSuccess: (data) => {
      if (!useSymbolStore.getState().currentFuture) {
        const currentFuture = data.find((item) => item.isSelect)
        if (currentFuture?.futuresCount) {
          useSymbolStore.setState({ currentFuture })
          return
        }
        useSymbolStore.setState({
          currentFuture: data.find((item) => item.isBest),
        })
      }
    },
  })
  const ref = useRef<BottomSheetBase>(null)
  useEffect(() => {
    ref.current?.close()
  }, [currentFuture])
  return (
    <Fragment>
      <XStack
        hitSlop={16}
        onPress={() => {
          setVisible((v) => !v)
        }}
        gap="$xs"
      >
        <Text subject>{currentFuture?.name}</Text>
        <XStack rotate="90deg">
          <Icon name="chevronRight" size={16}></Icon>
        </XStack>
      </XStack>
      {visible ? (
        <BottomSheet
          index={0}
          title={t("trade.categories")}
          ref={ref}
          // eslint-disable-next-line react-compiler/react-compiler
          onClose={ref.current?.close}
          onChange={(index) => {
            if (index === -1) {
              setVisible(false)
            }
          }}
        >
          <YStack pb={bottom}>
            {data?.map((item) => (
              <ListItem key={item.name} data={item}></ListItem>
            ))}
          </YStack>
        </BottomSheet>
      ) : null}
    </Fragment>
  )
}
