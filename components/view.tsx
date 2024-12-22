import { MotiView } from "moti"
import { FC } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { styled, YStack, YStackProps } from "tamagui"

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

export const Screen: FC<YStackProps> = ({ children, ...rest }) => {
  const { bottom } = useSafeAreaInsets()
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <YStack f={1} bc="$background" p="$md" gap="$md" pb={bottom} {...rest}>
        {children}
      </YStack>
    </KeyboardAvoidingView>
  )
}

export const Moti = styled(MotiView)
