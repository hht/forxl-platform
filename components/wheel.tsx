import * as Haptics from "expo-haptics"
import React, { memo } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

import colors from "~/theme/colors"

interface PickerItemProps {
  label: string
  value: string | number
}
interface WheelPickerProps {
  data: PickerItemProps[]
  value: string | number
  itemHeight?: number
  onValueChanged: (value: string | number) => void
  visibleItems?: number
}

const PickerItem: React.FC<{
  item: PickerItemProps
  index: number
  translateY: SharedValue<number>
  visibleItems: number
  itemHeight: number
}> = memo(({ item, index, translateY, visibleItems, itemHeight }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const v = (translateY.value + index * itemHeight) / itemHeight
    if (Math.abs(v) > (visibleItems + 1) / 2) {
      return {}
    }
    const scale =
      Math.cos((Math.abs(v) / ((visibleItems + 1) / 2)) * (Math.PI / 2)) * 0.4 +
      1 -
      0.4
    const opacity = interpolate(
      Math.abs(v),
      [0, (visibleItems + 1) / 2],
      [1, 0.1],
      Extrapolation.CLAMP
    )
    return {
      transform: [{ scaleX: scale }, { scaleY: scale * scale }],
      opacity,
    }
  })
  return (
    <Animated.View
      style={[styles.item, { height: itemHeight }, animatedStyle]}
      key={index}
    >
      <Text style={[styles.itemText, { lineHeight: itemHeight }]}>
        {item.label}
      </Text>
    </Animated.View>
  )
})

PickerItem.displayName = "PickerItem"

export const Picker: React.FC<WheelPickerProps> = ({
  data,
  value,
  onValueChanged,
  itemHeight = 50,
  visibleItems = 5,
}) => {
  const translateY = useSharedValue(-1)
  const lastTranslateY = useSharedValue(0)

  useDerivedValue(() => {
    if (Platform.OS === "web") {
      return
    }
    const distanceMoved = Math.abs(translateY.value - lastTranslateY.value)
    if (distanceMoved >= itemHeight) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light)
      lastTranslateY.value = translateY.value
    }
  })
  useDerivedValue(() => {
    if (translateY.value !== -1) {
      return
    }
    const index = data.findIndex((item) => item.value === value) ?? 0
    const current =
      index < 0 ? 0 : index > data.length - 1 ? data.length - 1 : index
    translateY.value = withSpring(-current * itemHeight, {
      damping: 20,
      stiffness: 90,
    })
  })

  const gesture = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(translateY)
    })
    .onChange((event) => {
      if (
        translateY.value > 0 ||
        translateY.value < -(data.length - 1) * itemHeight
      ) {
        return
      }
      translateY.value += event.changeY
    })
    .onEnd((event) => {
      const velocity = event.velocityY
      const index = Math.round(-(translateY.value + velocity) / itemHeight)
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1))
      translateY.value = withSpring(
        -clampedIndex * itemHeight,
        {
          damping: 20,
          mass: 2,
          stiffness: 90,
        },
        (finished) => {
          runOnJS(onValueChanged)(data[clampedIndex].value)
        }
      )
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value + (itemHeight * (visibleItems - 1)) / 2,
        },
      ],
    }
  })

  return (
    <View style={[styles.container, { height: itemHeight * visibleItems }]}>
      <GestureDetector gesture={gesture}>
        <View style={[styles.picker, { height: itemHeight * visibleItems }]}>
          <Animated.View style={[styles.picker, animatedStyle]}>
            {data.map((item, index) => (
              <PickerItem
                key={index}
                item={item}
                index={index}
                visibleItems={visibleItems}
                itemHeight={itemHeight}
                translateY={translateY}
              />
            ))}
          </Animated.View>
          <View
            style={[
              styles.overlay,
              {
                height: itemHeight,
                top: (itemHeight * (visibleItems - 1)) / 2,
              },
            ]}
          ></View>
        </View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    borderColor: colors.border,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    left: 0,
    right: 0,
  },
  picker: {
    width: "100%",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  itemText: {
    fontSize: 20,
    color: "white",
  },
})
