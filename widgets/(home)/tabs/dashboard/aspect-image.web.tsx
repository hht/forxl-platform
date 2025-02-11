import { FC, useState } from "react"
import { ActivityIndicator, Dimensions } from "react-native"
import { XStack } from "tamagui"

export const CAROUSEL_WIDTH = Dimensions.get("window").width - 32

export const AspectImage: FC<{ uri?: string; onPress: () => void }> = ({
  uri,
  onPress,
  ...rest
}) => {
  return (
    <XStack onPress={onPress}>
      <img
        style={{
          width: CAROUSEL_WIDTH,
          aspectRatio: "auto",
        }}
        src={uri}
        {...rest}
      />
    </XStack>
  )
}
