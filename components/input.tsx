import { MotiText as AnimatedText, MotiView as AnimatedView } from 'moti'
import { FC, useRef, useState } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { XStack } from 'tamagui'

import colors from '~/theme/colors'

export const Input: FC<
  {
    addonAfter?: React.ReactNode
    status?: "success" | "error"
    label?: string
    bc?: string
    backgroundColor?: string
  } & TextInputProps
> = ({
  status,
  label,
  placeholderTextColor,
  value,
  addonAfter,
  backgroundColor = colors.background,
  ...rest
}) => {
  const color =
    status === "error"
      ? colors.destructive
      : status === "success"
        ? colors.primary
        : colors.secondary

  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isFocused || !!value

  return (
    <XStack
      gap="$sm"
      boc={color}
      bw={1}
      br="$sm"
      ai="center"
      h={56}
      mih={56}
      px="$md"
      w="100%"
    >
      <TextInput
        placeholderTextColor="transparent"
        underlineColorAndroid={undefined}
        ref={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardAppearance="dark"
        value={value}
        style={[
          styles.container,
          {
            color: color === colors.secondary ? colors.text : color,
          },
        ]}
        {...rest}
      />
      {addonAfter}
      <AnimatedView
        style={[
          styles.label,
          {
            backgroundColor,
          },
        ]}
        animate={{
          top: isActive ? -12 : 16,
        }}
        transition={{
          type: "timing",
          duration: 200,
        }}
      >
        <AnimatedText
          animate={{
            // @ts-ignore next-line
            fontSize: isActive ? 12 : 15,
          }}
          transition={{
            type: "timing",
            duration: 200,
          }}
          style={{ color }}
        >
          {label}
        </AnimatedText>
      </AnimatedView>
    </XStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    fontSize: 15,
    borderWidth: 0,
    borderColor: "transparent",
  },
  label: {
    position: "absolute",
    paddingHorizontal: 4,
    left: 12,
    zIndex: 1,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
})
