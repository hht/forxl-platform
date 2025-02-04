import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'

import { getFutureCategories } from '~/api/trade'
import { BottomSheet, Icon, IconType, Text, XStack, YStack } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useSymbolStore } from '~/hooks/useStore'
import colors from '~/theme/colors'

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
      return "us"
    case "UK Storks":
      return "gbp"
    case "European Stocks":
      return "eu"
    case "HK_EQUITY":
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
      <Text title f={1} col={active ? colors.primary : colors.text}>
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
  const { loading, data } = useRequest(getFutureCategories, {
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
  const ref = useRef<BottomSheetModal>(null)
  useEffect(() => {
    if (currentFuture) {
      ref.current?.dismiss()
    }
  }, [currentFuture])
  return (
    <Fragment>
      <XStack
        hitSlop={16}
        onPress={() => {
          ref.current?.present()
        }}
        gap="$xs"
      >
        <Text subject>{currentFuture?.name}</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <XStack rotate="90deg">
            <Icon name="chevronRight" size={16}></Icon>
          </XStack>
        )}
      </XStack>
      <BottomSheet index={0} title={t("trade.categories")} ref={ref}>
        <YStack pb={bottom}>
          {data?.map((item) => (
            <ListItem key={item.name} data={item}></ListItem>
          ))}
        </YStack>
      </BottomSheet>
    </Fragment>
  )
}
