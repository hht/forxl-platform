import { useRef } from "react"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated"

import { formatCurrency, formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"

export const AnimatedFlow = ({
  value,
  fraction = 0.01,
  addonsBefore = "",
  addonsAfter = "",
  fontSize = 13,
  color,
  bold = false,
}: {
  value: number
  fraction?: number
  addonsBefore?: string
  addonsAfter?: string
  fontSize?: number
  bold?: boolean
  color?: string
}) => {
  const scale = useSharedValue(1)
  const previous = useRef(value)
  useDerivedValue(() => {
    if (previous.current !== value)
      scale.value = withSequence(
        withSpring(1.05, {
          damping: 5,
          stiffness: 200,
        }),
        withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
      )
    previous.current = value
  })
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: color
        ? color
        : value > 0
          ? colors.primary
          : value < 0
            ? colors.destructive
            : colors.secondary,
      fontWeight: bold ? "bold" : "normal",
      fontSize,
      lineHeight: fontSize * 1.2,
      transform: [{ scale: scale.value }],
      fontVariant: ["tabular-nums"],
    }
  })
  return (
    <Animated.Text
      style={animatedStyle}
    >{`${addonsBefore.replace("$", "")}${addonsBefore.includes("$") ? formatCurrency(value, fraction) : formatDecimal(value, fraction)}${addonsAfter}`}</Animated.Text>
  )
}
