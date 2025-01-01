import { ErrorBoundary } from 'expo-router'
import { MotiView } from 'moti'
import { FC, Fragment } from 'react'
import { ActivityIndicator, Platform } from 'react-native'
import { AvoidSoftInputView, AvoidSoftInputViewProps } from 'react-native-avoid-softinput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, XStack, YStack, YStackProps } from 'tamagui'

import { Text } from './text'

import colors from '~/theme/colors'

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

export const Justified = styled(XStack, {
  ai: "center",
  jc: "space-between",
  fw: "wrap",
})

export const Row = styled(XStack, {
  ai: "center",
})

export const Dialog = styled(View, {
  bc: "$card",
  boc: "$border",
  bw: 1,
  br: "$sm",
  px: 24,
  py: 32,
  gap: 12,
})

export const Screen: FC<YStackProps> = ({ children, ...rest }) => {
  const { bottom } = useSafeAreaInsets()
  return (
    <YStack f={1} bc="$background" p="$md" gap="$md" pb={bottom} {...rest}>
      {children}
    </YStack>
  )
}

export const Boundary: FC<
  YStackProps & { isLoading?: boolean; error?: Error }
> = ({ children, isLoading, error, ...rest }) => {
  return isLoading ? (
    <YStack f={1} bc="$background" ai="center" jc="center" gap="$md">
      <ActivityIndicator color={colors.secondary} />
    </YStack>
  ) : error ? (
    <Text>{error.message}</Text>
  ) : (
    children
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
