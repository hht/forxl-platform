import { useDerivedValue } from "react-native-reanimated"

import { Text } from "./text"

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
  return (
    <Text
      col={
        color
          ? color
          : value > 0
            ? colors.primary
            : value < 0
              ? colors.destructive
              : colors.secondary
      }
      fos={fontSize}
      bold={bold}
    >{`${addonsBefore.replace("$", "")}${addonsBefore.includes("$") ? formatCurrency(value, fraction) : formatDecimal(value, fraction)}${addonsAfter}`}</Text>
  )
}
