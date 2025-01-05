import * as Clipboard from "expo-clipboard"
import _ from "lodash"
import { FC, useMemo, useRef } from "react"
import { styled, Text as TamaText, TextProps, XStack } from "tamagui"

import { Icon } from "./icon"
import { toast } from "./toast"

import { formatDecimal, t } from "~/lib/utils"

/**
 * 默认字体组件
 *
 * 字体大小定义: 默认13
 *
 * 行高定义根据字体大小按照设计图比例设定
 */
export const Text = styled(TamaText, {
  name: "Text",
  col: "$text",
  fow: "400",
  ff: "Inter",
  fos: 13,
  lh: 16,
  variants: {
    subject: {
      true: {
        fos: 20,
        lh: 24,
        fow: "900",
      },
    },
    head: {
      true: {
        fos: 15,
        lh: 17,
        fow: "900",
      },
    },
    caption: {
      true: {
        fos: 11,
        lg: 14,
        fow: "400",
      },
    },
  } as const,
})

export const copyToClipboard = async (
  text?: string | number
): Promise<void> => {
  try {
    if (!text) {
      throw new Error("No text to copy")
    }
    await Clipboard.setStringAsync(`${text}`)
    toast.show(t("message.copiedSuccess"))
  } catch (err) {
    toast.show(t("message.copiedFailed"))
  }
}

export const Copyable: FC<{ children?: string } & TextProps> = ({
  children,
  ...rest
}) => {
  return (
    <XStack
      gap="$xs"
      ai="center"
      onPress={() => {
        copyToClipboard(children)
      }}
    >
      <Text {...rest}>{children}</Text>
      <Icon name="copy" size={12}></Icon>
    </XStack>
  )
}

export const AnimatedFlow = ({
  value,
  fraction = 0.01,
  addonsBefore,
  addonsAfter,
  ...rest
}: {
  value: number
  fraction?: number
  addonsBefore?: React.ReactNode
  addonsAfter?: React.ReactNode
  gradientClassName?: string
} & TextProps) => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <XStack ref={ref}>
      <Text
        fos={13}
        col={value > 0 ? "$primary" : "$destructive"}
        {...rest}
        ff="$mono"
      >
        {addonsBefore}
        {_.isNumber(value) && !_.isNaN(value)
          ? `${formatDecimal(value, fraction)}`
          : null}
        {addonsAfter}
      </Text>
    </XStack>
  )
}
