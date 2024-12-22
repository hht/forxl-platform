import { router } from "expo-router"
import { FC } from "react"
import { Platform } from "react-native"
import { TextProps } from "tamagui"

import { Text } from "~/components"
import { useWebViewStore } from "~/hooks/useStore"

export const WebLink: FC<{ href: string } & TextProps> = ({
  href,
  children,
  ...rest
}) => {
  return (
    <Text
      onPress={() => {
        if (Platform.OS === "web") {
          window.open(href, "_blank")
          return
        }
        useWebViewStore.setState({ uri: href })
        router.push("/web-view")
      }}
      hitSlop={10}
      {...rest}
    >
      {" "}
      {children}
    </Text>
  )
}
