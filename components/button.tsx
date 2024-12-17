import _ from 'lodash'
import { forwardRef, Ref } from 'react'
import { View } from 'react-native'
import { Button as TamaButton, ButtonProps, Spinner } from 'tamagui'

import { Text } from './text'

export type ButtonType =
  | "primary"
  | "ghost"
  | "destructive"
  | "accent"
  | "warning"
  | "icon"

const getButtonStyle = ({
  type = "primary",
}: {
  type?: ButtonType
  disabled?: boolean
}): ButtonProps => {
  const color = `$${type}`
  switch (type) {
    case "primary":
    case "destructive":
    case "warning":
      return {
        bc: color,
        boc: color,
        color: "$background",
        pressStyle: {
          bc: color,
          boc: color,
          opacity: 0.8,
        },
        hoverStyle: {
          bc: color,
          boc: color,
        },
      }
    case "accent":
      return {
        bc: "$accent",
        boc: "$accent",
        color: "$text",
        pressStyle: {
          bc: "$accent",
          boc: "$accent",
          opacity: 0.8,
        },
        hoverStyle: {
          bc: "$accent",
          boc: "$accent",
        },
      }
    case "ghost":
      return {
        bc: "transparent",
        boc: "$destructive",
        color: "$destructive",
        pressStyle: {
          bc: "transparent",
          boc: "$destructive",
          opacity: 0.8,
        },
        hoverStyle: {
          bc: "transparent",
          boc: "$destructive",
        },
      }
    case "icon":
      return {
        bc: "transparent",
        boc: "transparent",
        color: "$destructive",
        pressStyle: {
          bc: "transparent",
          boc: "transparent",
          opacity: 0.8,
        },
        hoverStyle: {
          bc: "transparent",
          boc: "transparent",
        },
      }
    default:
      return {
        boc: "$primary",
        bw: 1,
        px: 10,
        height: 48,
        color: "$background",
      }
  }
}

const getHeight = (size?: "$sm" | "$lg") => {
  switch (size) {
    case "$sm":
      return 32
    default:
      return 48
  }
}
/**
 * 按钮组件
 *
 * 按钮类型: primary, ghost, flatten, 默认primary
 *
 * 按钮高度: sm:32, md:40,默认44
 */
export const Button = forwardRef(
  (
    {
      disabled,
      isLoading,
      children,
      icon,
      size,
      type = "primary",
      ...rest
    }: {
      isLoading?: boolean
      type?: ButtonType
      size?: "$sm" | "$lg" | "$icon"
    } & ButtonProps,
    ref: Ref<View>
  ) => {
    const isDisabled = disabled ?? isLoading
    const styles = getButtonStyle({ type, disabled: isDisabled })
    if (size === "$icon") {
      return (
        <TamaButton
          boc="$primary"
          bw={1}
          px={0}
          py={0}
          hitSlop={10}
          ref={ref}
          color={rest.color ?? styles.color}
          o={disabled || isLoading ? 0.6 : 1}
          {...styles}
          h={40}
          w={40}
          {...rest}
          disabled={isDisabled}
        >
          {isLoading ? (
            <Spinner size="small" />
          ) : _.isString(children) ? (
            <Text fos={16} fow="600" col={rest.color ?? styles.color}>
              {children}
            </Text>
          ) : (
            children
          )}
        </TamaButton>
      )
    }
    return (
      <TamaButton
        boc="$primary"
        bw={1}
        ai="center"
        jc="center"
        br={6}
        ref={ref}
        color="$background"
        {...styles}
        o={disabled || isLoading ? 0.5 : 1}
        {...rest}
        height={getHeight(size)}
        disabled={isDisabled}
        icon={isLoading ? <Spinner size="small" /> : icon}
      >
        {_.isString(children) ? (
          <Text fos={16} lh={20} fow="600" col={styles.color}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TamaButton>
    )
  }
)

Button.displayName = "Button"
