import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { XStack } from 'tamagui'

import colors from '~/theme/colors'

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export const Switch: FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled,
}) => {
  const offset = useSharedValue(checked ? 20 : 0)
  const backgroundColor = useSharedValue(
    checked ? colors.primary : colors.tertiary
  )

  const toggleSwitch = () => {
    if (disabled) return

    const v = !checked
    offset.value = withTiming(v ? 20 : 0)
    backgroundColor.value = withTiming(v ? colors.primary : colors.tertiary)
    onCheckedChange?.(v)
  }

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }))

  return (
    <XStack
      ai="center"
      jc="center"
      onPress={toggleSwitch}
      o={disabled ? 0.5 : 1}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </XStack>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    borderColor: "transparent",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

Switch.displayName = "Switch"
