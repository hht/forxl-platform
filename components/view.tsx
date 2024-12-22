import { MotiView } from "moti"
import { FC } from "react"
import { Platform } from "react-native"
import {
  AvoidSoftInputView,
  AvoidSoftInputViewProps,
} from "react-native-avoid-softinput"
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
  bc: "$card/60",
  bw: 1,
  boc: "$border",
})

export const Screen: FC<YStackProps> = ({ children, ...rest }) => {
  const { bottom } = useSafeAreaInsets()
  return (
    <YStack f={1} bc="$background" p="$md" gap="$md" pb={bottom} {...rest}>
      {children}
    </YStack>
  )
}

export const KeyboardAvoiding: FC<AvoidSoftInputViewProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <AvoidSoftInputView
      easing="easeIn"
      enabled={true}
      avoidOffset={Platform.OS === "ios" ? 16 : 32}
      hideAnimationDelay={100}
      hideAnimationDuration={300}
      showAnimationDelay={100}
      showAnimationDuration={300}
      style={[{ flex: 1, width: "100%" }, style]}
      {...rest}
    >
      {children}
    </AvoidSoftInputView>
  )
}

export const Moti = styled(MotiView)
