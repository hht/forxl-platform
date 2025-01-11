import { useIsFocused } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { LayoutRectangle, StyleSheet } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { XStack } from "tamagui"

import { Text } from "./text"

import colors from "~/theme/colors"

interface TabsProps {
  data: string[]
  activeIndex: number
  onChange: (index: number) => void
}

export const Tabs: React.FC<TabsProps> = ({ data, activeIndex, onChange }) => {
  const [tabLayouts, setTabLayouts] = useState<LayoutRectangle[]>([])
  const translateX = useSharedValue(0)
  const width = useSharedValue(0)

  const onTabLayout = useCallback((event: any, index: number) => {
    const layout = event.nativeEvent.layout
    setTabLayouts((prev) => {
      const newLayouts = [...prev]
      newLayouts[index] = layout
      return newLayouts
    })
  }, [])

  React.useEffect(() => {
    if (tabLayouts[activeIndex]) {
      translateX.value = withSpring(tabLayouts[activeIndex].x)
      width.value = withSpring(tabLayouts[activeIndex].width)
    }
  }, [activeIndex, tabLayouts, translateX, width])

  const isFocused = useIsFocused()
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: width.value,
    }
  }, [isFocused])

  return (
    <XStack w="100%" pb="$sm">
      <XStack h="100%" w="100%" gap="$lg">
        {data.map((tab, index) => (
          <XStack
            key={index}
            onLayout={(e) => onTabLayout(e, index)}
            onPress={() => onChange(index)}
            hitSlop={16}
          >
            <Text
              fow={activeIndex === index ? "bold" : "400"}
              lh={16}
              col={activeIndex === index ? "$primary" : "$secondary"}
            >
              {tab}
            </Text>
          </XStack>
        ))}
      </XStack>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </XStack>
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
    width: 200,
  },
})
