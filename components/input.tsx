import { useBoolean } from 'ahooks'
import _ from 'lodash'
import { MotiText as AnimatedText, MotiView as AnimatedView } from 'moti'
import React, { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, Platform, StyleSheet, TextInput, TextInputProps } from 'react-native'
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming
} from 'react-native-reanimated'
import { XStack, YStack } from 'tamagui'

import { Button } from './button'
import { Icon } from './icon'
import { Text } from './text'
import { toast } from './toast'

import { DEVICE_WIDTH, t } from '~/lib/utils'
import colors from '~/theme/colors'

interface InputProps extends TextInputProps {
  addonAfter?: React.ReactNode
  status?: "success" | "error"
  label?: string
  bc?: string
  backgroundColor?: string
  message?: string
  disableValidation?: boolean
}

export const InputBase: FC<InputProps> = ({
  status,
  label,
  placeholderTextColor,
  value,
  addonAfter,
  message,
  disableValidation,
  backgroundColor = colors.background,
  ...rest
}) => {
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isFocused || !!value
  const color =
    // eslint-disable-next-line react-compiler/react-compiler
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
        {label ? (
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
        ) : null}
      </XStack>
      {disableValidation ? null : (
        <Text col="$destructive" fos={12}>
          {value && !isFocused ? (message ?? "  ") : "  "}
        </Text>
      )}
    </YStack>
  )
}

const Password: FC<InputProps> = ({ addonAfter, value, ...props }) => {
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

const OTP_WIDTH = (DEVICE_WIDTH - 32 - 16 * 5) / 6

const OTP = ({
  length = 6,
  disabled = false,
  value = "",
  onChange,
  onComplete,
}: OTPInputProps) => {
  const [digits, setDigits] = useState(
    value.split("").concat(new Array(length).fill("")).slice(0, length)
  )
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const cursorOpacity = useSharedValue(0)
  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }))
  useEffect(() => {
    setDigits(
      value.split("").concat(new Array(length).fill("")).slice(0, length)
    )
  }, [value, setDigits, length])
  useEffect(() => {
    if (focused) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1
      )
    } else {
      cursorOpacity.value = withTiming(0)
    }
  }, [cursorOpacity, focused])

  const onChangeText = useCallback(
    (text: string) => {
      if (!/^\d*$/.test(text)) {
        return
      }
      const newDigits = [...digits]
      const currentIndex = newDigits.findIndex((d) => !d)

      if (currentIndex !== -1) {
        newDigits[currentIndex] = text.slice(-1)
        setDigits(newDigits)
        onChange?.(newDigits.join(""))

        if (newDigits.every((d) => d) && newDigits.length === length) {
          onComplete?.(newDigits.join(""))
          inputRef.current?.blur()
        }
      }
    },
    [digits, length, onChange, onComplete]
  )

  const onKeyPress = useCallback(
    ({ nativeEvent: { key } }: any) => {
      if (key === "Backspace") {
        const newDigits = [...digits]
        const lastFilledIndex = newDigits.map((d) => !!d).lastIndexOf(true)

        if (lastFilledIndex !== -1) {
          newDigits[lastFilledIndex] = ""
          setDigits(newDigits)
          onChange?.(newDigits.join(""))
        }
      }
    },
    [digits, onChange]
  )

  const onPress = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])
  useEffect(() => {
    // const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
    //   setFocused(true)
    // })
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setFocused(false)
      inputRef.current?.blur()
    })

    return () => {
      // showSubscription.remove()
      hideSubscription.remove()
    }
  }, [setFocused])
  return (
    <Fragment>
      <TextInput
        ref={inputRef}
        value=""
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        maxLength={1}
        keyboardType="number-pad"
        style={styles.hidden}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
      />
      <XStack gap="$md" onPress={onPress}>
        {digits.map((digit, index) => (
          <YStack
            key={index}
            w={OTP_WIDTH}
            height={OTP_WIDTH}
            bw={1}
            boc={digit ? "$primary" : "$secondary"}
            br="$sm"
            ai="center"
            jc="center"
            bc="$background"
          >
            <Text subject>{digit}</Text>
            {focused && !digit && index === digits.findIndex((d) => !d) && (
              <Animated.View style={[styles.cursor, cursorStyle]} />
            )}
          </YStack>
        ))}
      </XStack>
    </Fragment>
  )
}

const AMOUNT_REGEX = /^\d*\.?\d{0,2}$/

const Decimal: FC<
  Omit<InputProps, "onChange" | "value"> & {
    value?: number
    onChange: (v?: number) => void
    max?: number
    min?: number
  }
> = ({ value, onChange, min, max, ...props }) => {
  return (
    <InputBase
      value={`${value ?? ""}`}
      keyboardType="decimal-pad"
      onChangeText={(e) => {
        if (!e || e === "") {
          onChange(undefined)
          return
        }
        const value = e.replace(/,/g, '.')
        // 验证输入格式
        if (!AMOUNT_REGEX.test(value)) {
          return
        }
        if (max && parseFloat(value) > parseFloat(`${max}`)) {
          onChange(parseFloat(`${max}`))
          toast.show(t("message.maxReached"))
          return
        }
        const v = parseFloat(value)
        if (_.isNumber(v) && !_.isNaN(v)) {
          onChange(v)
        }
      }}
      onBlur={() => {
        if (!value) {
          return
        }
        if (min && value < min) {
          toast.show(t("message.minReached"))
          return
        }
      }}
      {...props}
    />
  )
}

interface DigitProps extends Omit<InputProps, "onChange" | "value"> {
  value?: number
  onChange: (v?: number) => void
  step?: number
  min?: number
  max?: number
  precision?: number
}
const Digit: FC<DigitProps> = ({
  value,
  min = 0,
  max = 999999999,
  step = 0.01,
  precision = 2,
  onChange,
  editable = true,
  ...props
}) => {
  // 1. 优化正则表达式
  const patterns = useMemo(
    () => ({
      // 允许输入过程状态
      input: new RegExp(`^\\d*\\.?\\d{0,${precision}}$|^\\d+\\.$`),
      // 验证最终值
      valid: new RegExp(`^\\d+(\\.\\d{0,${precision}})?$`),
    }),
    [precision]
  )

  // 2. 优化值格式化
  const formatValue = useCallback(
    (num?: number) => {
      if (_.isUndefined(num)) return ""
      return Number(num.toFixed(precision).toString()).toString()
    },
    [precision]
  )

  // 3. 优化值规范化
  const normalizeValue = useCallback(
    (value?: number) => {
      if (_.isUndefined(value)) return undefined
      const rounded = _.round(value, precision)
      return _.clamp(rounded, min, max)
    },
    [min, max, precision]
  )

  // 4. 状态管理
  const [displayValue, setDisplayValue] = useState(() => formatValue(value))

  // 5. 优化值更新逻辑
  const onValueChange = useCallback(
    (newValue?: number, options?: { format?: boolean }) => {
      const normalizedValue = normalizeValue(newValue)

      if (!_.isUndefined(normalizedValue)) {
        // 只在非编辑状态下格式化显示
        setDisplayValue(
          options?.format ? formatValue(normalizedValue) : String(newValue)
        )

        if (normalizedValue !== newValue) {
          if (normalizedValue === max) {
            setDisplayValue(formatValue(max))
            toast.show(t("message.maxReached"))
          } else if (normalizedValue === min) {
            setDisplayValue(formatValue(min))
            toast.show(t("message.minReached"))
          }
        }
      } else {
        setDisplayValue("")
      }

      onChange(normalizedValue)
    },
    [normalizeValue, formatValue, onChange, min, max]
  )

  // 6. 当值变化时更新显示值
  React.useEffect(() => {
    if (
      parseFloat(displayValue).toFixed(precision) === value?.toFixed(precision)
    ) {
      return
    }
    setDisplayValue(formatValue(value))
  }, [value, displayValue, formatValue, precision])
  return (
    <XStack h={56} w="100%" boc="$border" br="$sm" bw={1} ai="center">
      <Button
        type="icon"
        disabled={!editable}
        onPress={() => onValueChange((value ?? 0) - step, { format: true })}
      >
        <Icon name="minus" />
      </Button>

      <TextInput
        {...props}
        placeholderTextColor="transparent"
        underlineColorAndroid={undefined}
        keyboardType="decimal-pad"
        value={displayValue}
        onChangeText={(text) => {
          if (!text) {
            onValueChange(undefined)
            return
          }
          const value = text.replace(/,/g, '.')
          if (!patterns.input.test(value)) return

          const numValue = parseFloat(value)
          if (value.endsWith(".") || value.endsWith("0")) {
            setDisplayValue(value)
            if (!_.isNaN(numValue)) {
              onChange(numValue)
            }
          } else {
            onValueChange(numValue)
          }
        }}
        keyboardAppearance="dark"
        style={[styles.container, styles.digit, { textAlign: "center" }]}
        editable={editable}
      />

      <Button
        type="icon"
        disabled={!editable}
        onPress={() => onValueChange((value ?? 0) + step, { format: true })}
      >
        <Icon name="plus" />
      </Button>
    </XStack>
  )
}
export const Input = Object.assign(InputBase, {
  Password,
  OTP,
  Digit,
  Decimal,
})

Password.displayName = "PasswordInput"

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? "100%" : undefined,
    height: "100%",
    flex: Platform.OS === "web" ? undefined : 1,
    backgroundColor: "transparent",
    fontSize: 15,
    borderWidth: 0,
    borderColor: "transparent",
  },
  digit: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 20,
  },
  cursor: {
    position: "absolute",
    width: 2,
    height: 24,
    backgroundColor: colors.primary,
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
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
})
