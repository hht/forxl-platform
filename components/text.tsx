import { FC } from "react"
import {
  styled,
  Text as TamaText,
  TextProps,
  XStack,
  XStackProps,
} from "tamagui"

import { Button } from "./button"
import { Icon } from "./icon"

import { copyToClipboard } from "~/lib/utils"

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
