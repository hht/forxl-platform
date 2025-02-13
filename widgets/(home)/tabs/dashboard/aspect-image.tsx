import { FC, useState } from "react"
import { ActivityIndicator, Dimensions, Image } from "react-native"
import { XStack } from "tamagui"

export const CAROUSEL_WIDTH = Dimensions.get("window").width - 32

export const AspectImage: FC<{ uri?: string; onPress: () => void }> = ({
  uri,
  onPress,
  ...rest
}) => {
  const [ratio, setRatio] = useState(343 / 160)
  const [loaded, setLoaded] = useState(false)
  return (
    <XStack w={CAROUSEL_WIDTH} onPress={onPress}>
      <Image
        onLoad={(e) => {
          setRatio(e.nativeEvent.source.width / e.nativeEvent.source.height)
        }}
        style={{
          width: CAROUSEL_WIDTH,
          aspectRatio: ratio,
        }}
        onLoadEnd={() => setLoaded(true)}
        source={{ uri }}
        {...rest}
      />
      {loaded ? null : (
        <XStack
          pos="absolute"
          t={0}
          r={0}
          l={0}
          b={0}
          ai="center"
          jc="center"
          bc="$card"
        >
          <ActivityIndicator />
        </XStack>
      )}
    </XStack>
  )
}
