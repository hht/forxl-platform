import { styled, Text as TamaText } from "tamagui"

/**
 * 默认字体组件
 *
 * 字体大小定义: 默认14
 *
 * 行高定义根据字体大小按照设计图比例设定
 */
export const Text = styled(TamaText, {
  name: "Text",
  color: "$text",
  fontWeight: "400",
  fontFamily: "Inter",
  fontSize: 13,
  lineHeight: 16,
  variants: {
    head: {
      true: {
        fontSize: 15,
        lineHeight: 17,
        fontWeight: "400",
      },
    },
    caption: {
      true: {
        fontSize: 11,
        lineHeight: 14,
        fontWeight: "400",
      },
    },
  } as const,
})
