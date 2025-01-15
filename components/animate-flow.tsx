import _ from "lodash"
import { FC, memo, useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import Animated, {
  makeMutable,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { XStack, YStack } from "tamagui"

import { Text } from "./text"

import { formatCurrency, formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"

const numbers = "0123456789".split("").join("\n")

const RATIO = 1.2
const TWEAK = Platform.OS === "android" ? 0.99 : 1

const DigitRow: FC<{
  value: SharedValue<string>
  fontSize: number
  bold?: boolean
  color: SharedValue<string>
}> = memo(({ value, color, fontSize, bold, ...rest }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: color.value,
      fontSize,
      lineHeight: fontSize * RATIO,
      fontWeight: bold ? "bold" : "normal",
    }
  })
  const viewStyle = useAnimatedStyle(() => {
    if (isNaN(parseInt(value.value))) {
      return {}
    }
    return {
      transform: [
        {
          translateY: withSpring(
            parseInt(value.value) * fontSize * -RATIO * TWEAK
          ),
        },
      ],
    }
  })
  console.log("Rerender")
  if (isNaN(parseInt(value.value))) {
    return (
      <YStack h={fontSize * RATIO}>
        <Animated.Text style={animatedStyle}>{value.value}</Animated.Text>
      </YStack>
    )
  }
  return (
    <YStack h={fontSize * RATIO} ov="hidden">
      <Animated.View style={[{ height: fontSize * RATIO * 10 }, viewStyle]}>
        <Animated.Text
          style={[{ height: fontSize * RATIO * 10 }, animatedStyle]}
        >
          {numbers}
        </Animated.Text>
      </Animated.View>
    </YStack>
  )
})

DigitRow.displayName = "DigitRow"

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
  const [length, setLength] = useState(0)
  return (
    <Text
      col={color}
      fos={fontSize}
      bold={bold}
    >{`${addonsBefore.replace("$", "")}${addonsBefore.includes("$") ? formatCurrency(value, fraction) : formatDecimal(value, fraction)}${addonsAfter}`}</Text>
  )
  const digits = useRef<SharedValue<string>[]>([])
  const col = useSharedValue("$text")
  useDerivedValue(() => {
    col.value = color
      ? color
      : value > 0
        ? colors.primary
        : value < 0
          ? colors.destructive
          : colors.secondary
  })
  useEffect(() => {
    const current =
      `${addonsBefore.replace("$", "")}${addonsBefore.includes("$") ? formatCurrency(value, fraction) : formatDecimal(value, fraction)}${addonsAfter}`.split(
        ""
      )
    if (current.length === digits.current.length) {
      digits.current.forEach((digit, i) => {
        if (digit) {
          digit.value = current[i]
        } else {
          digits.current[i] = makeMutable(current[i])
        }
      })
    } else {
      digits.current = current.map((char) => {
        return makeMutable(char)
      })
      setLength(current.length)
    }
  }, [value, fraction, addonsBefore, addonsAfter])
  if (!_.isNumber(value) || _.isNaN(value)) {
    return null
  }
  return (
    <XStack>
      {_.times(length).map((_, i) => (
        <DigitRow
          key={i}
          value={digits.current[i]}
          bold={bold}
          fontSize={fontSize}
          color={col}
        />
      ))}
    </XStack>
  )
}
