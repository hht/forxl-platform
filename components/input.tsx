import { useBoolean } from "ahooks"
import { MotiText as AnimatedText, MotiView as AnimatedView } from "moti"
import { FC, useRef, useState } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"
import { XStack, YStack } from "tamagui"

import { Button } from "./button"
import { Icon } from "./icon"
import { Text } from "./text"

import colors from "~/theme/colors"

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

export const Input = Object.assign(InputBase, {
  Password,
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
