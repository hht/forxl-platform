import { useBoolean } from 'ahooks'
import { MotiText as AnimatedText, MotiView as AnimatedView } from 'moti'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import Animated, {
    useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming
} from 'react-native-reanimated'
import { XStack, YStack } from 'tamagui'

import { Button } from './button'
import { Icon } from './icon'
import { Text } from './text'

import colors from '~/theme/colors'

interface InputProps extends TextInputProps {
  addonAfter?: React.ReactNode
  status?: "success" | "error"
  label?: string
  bc?: string
  backgroundColor?: string
  message?: string
}

export const InputBase: FC<InputProps> = ({
  status,
  label,
  placeholderTextColor,
  value,
  addonAfter,
  message,
  backgroundColor = colors.background,
  ...rest
}) => {
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isFocused || !!value
  const color =
    !inputRef.current?.isFocused() && value
      ? status === "error"
        ? colors.destructive
        : status === "success"
          ? colors.primary
          : colors.secondary
      : colors.secondary
  return (
    <YStack gap="$xs">
      <XStack
        gap="$sm"
        boc={color === colors.secondary ? colors.border : color}
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
      <Text col="$destructive" fos={12}>
        {value && !isFocused ? (message ?? "") : ""}
      </Text>
    </YStack>
  )
}

const Password: FC<InputProps> = ({
  className,
  addonAfter,
  value,
  ...props
}) => {
  const [hidden, { toggle }] = useBoolean(true)
  return (
    <InputBase
      secureTextEntry={hidden}
      value={value}
      addonAfter={
        <Button
          type="icon"
          size="$icon"
          px={0}
          disabled={!value}
          onPress={toggle}
        >
          <Icon name={hidden ? "eyeOff" : "eye"} />
        </Button>
      }
      {...props}
    />
  )
}

interface OTPInputProps {
  length?: number
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
}

export const OTP = ({
  length = 6,
  disabled = false,
  value = "",
  onChange,
  onComplete,
}: OTPInputProps) => {
  const [focused, setFocused] = useState(false)
  const [digits, setDigits] = useState(
    value.split("").concat(new Array(length).fill("")).slice(0, length)
  )
  const cursorOpacity = useSharedValue(1)

  // 光标动画
  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }))

  useEffect(() => {
    if (focused) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      )
    } else {
      cursorOpacity.value = withTiming(0)
    }
  }, [focused, cursorOpacity])

  const onKeyPress = useCallback(
    (key: string) => {
      if (disabled) return
      const newDigits = [...digits]
      const currentIndex = newDigits.findIndex((d) => !d)

      if (key === "Backspace") {
        const lastFilledIndex = newDigits.map((d) => !!d).lastIndexOf(true)
        if (lastFilledIndex !== -1) {
          newDigits[lastFilledIndex] = ""
          setDigits(newDigits)
          onChange?.(newDigits.join(""))
        }
        return
      }

      if (currentIndex !== -1 && /^\d$/.test(key)) {
        newDigits[currentIndex] = key
        setDigits(newDigits)
        onChange?.(newDigits.join(""))

        if (newDigits.every((d) => d)) {
          onComplete?.(newDigits.join(""))
        }
      }
    },
    [digits, disabled, onChange, onComplete]
  )

  useEffect(() => {
    const keyboardListener = ({ key }: KeyboardEvent) => {
      if (focused) {
        onKeyPress(key)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", keyboardListener)
      return () => window.removeEventListener("keydown", keyboardListener)
    }
  }, [focused, onKeyPress])

  return (
    <XStack gap="$2" onPress={() => !disabled && setFocused(true)}>
      {digits.map((digit, index) => (
        <YStack
          key={index}
          width={40}
          height={48}
          borderWidth={1}
          borderColor={
            focused && !digit && index === digits.findIndex((d) => !d)
              ? "$primary"
              : "$border"
          }
          borderRadius="$2"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$background"
        >
          <Text fontSize={20}>{digit}</Text>
          {focused && !digit && index === digits.findIndex((d) => !d) && (
            <Animated.View style={[styles.cursor, cursorStyle]} />
          )}
        </YStack>
      ))}
    </XStack>
  )
}

export const Input = Object.assign(InputBase, {
  Password,
  OTP,
})

Password.displayName = "PasswordInput"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    fontSize: 15,
    borderWidth: 0,
    borderColor: "transparent",
  },
  cursor: {
    position: "absolute",
    width: 2,
    height: 24,
    backgroundColor: "#000",
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
