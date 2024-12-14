import _ from "lodash"
import { FC, memo } from "react"
import {
  Button as TamaButton,
  ButtonProps,
  Spinner,
  StackProps,
  XStack,
} from "tamagui"
import { shallow } from "zustand/shallow"

import { Image } from "./image"
import { Text } from "./text"

export type ButtonType = "primary" | "ghost" | "destructive" | "secondary"

const getButtonStyle = ({
  type = "primary",
}: {
  type?: ButtonType
  disabled?: boolean
}): ButtonProps => {
  switch (type) {
    case "primary":
      return {
        bc: "$primary",
        borderColor: "$primary",
        color: "$background",
        pressStyle: {
          bc: "$primary",
          borderColor: "$primary",
          scale: 0.99,
          opacity: 0.8,
        },
      }
    case "destructive":
      return {
        bc: "$destructive",
        borderColor: "$destructive",
        color: "$background",
        pressStyle: {
          bc: "$destructive",
          borderColor: "$destructive",
          scale: 0.99,
          opacity: 0.8,
        },
      }
    case "secondary":
      return {
        bc: "$card",
        borderColor: "$card",
        color: "$text",
        pressStyle: {
          bc: "$card",
          borderColor: "$card",
          scale: 0.99,
          opacity: 0.8,
        },
      }
    case "ghost":
      return {
        bc: "$transparent",
        borderColor: "$primary",
        color: "$background",
        pressStyle: {
          bc: "$transparent",
          borderColor: "$primary",
          scale: 0.99,
          opacity: 0.8,
        },
      }
    default:
      return {
        borderColor: "$primary",
        bw: 1,
        px: 10,
        height: 40,
        color: "$background",
      }
  }
}

const getHeight = (size?: "$sm" | "$lg") => {
  switch (size) {
    case "$sm":
      return 32
    case "$lg":
      return 44
    default:
      return 40
  }
}
/**
 * 按钮组件
 *
 * 按钮类型: primary, ghost, flatten, 默认primary
 *
 * 按钮高度: sm:32, md:40,默认44
 */
export const Button: FC<
  {
    isLoading?: boolean
    type?: ButtonType
    size?: "$sm" | "$lg"
  } & ButtonProps
> = memo(
  ({
    disabled,
    isLoading,
    children,
    icon,
    size,
    type = "primary",
    ...rest
  }) => {
    const isDisabled = disabled ?? isLoading
    const styles = getButtonStyle({ type, disabled: isDisabled })
    return (
      <TamaButton
        borderColor="$primary"
        bw={1}
        fontWeight="500"
        px={10}
        py={0}
        ai="center"
        jc="center"
        br={6}
        color="$ButtonText"
        {...styles}
        o={disabled || isLoading ? 0.5 : 1}
        {...rest}
        height={getHeight(size)}
        disabled={isDisabled}
        icon={isLoading ? <Spinner size="small" /> : icon}
      >
        {_.isString(children) ? (
          <Text fos={16} fow="500" col={styles.color}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TamaButton>
    )
  }
)
