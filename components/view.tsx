import { MotiView } from 'moti'
import { styled, YStack } from 'tamagui'

export const View = styled(YStack, {
  name: "View",
  w: "100%",
  gap: 8,
  variants: {
    bordered: {
      true: {
        br: 8,
        bw: 1,
        boc: "$border",
      },
    },
  } as const,
})

export const Card = styled(View, {
  name: "Card",
  p: 16,
  br: 8,
  bc: "$card",
})

export const Moti = styled(MotiView)
