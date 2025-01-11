import { FC, ReactNode } from "react"
import { XStack, YStack } from "tamagui"

import { Text } from "./text"

export const Stepper: FC<{ children: ReactNode[] }> = ({ children }) => {
  const childrenLength = children.filter((it) => !!it).length
  return (
    <YStack pl={12}>
      {children
        .filter((it) => !!it)
        .map((it, index) => (
          <XStack
            blc="$border"
            blw={childrenLength - 1 === index ? 0 : 1}
            pl={24}
            key={index}
          >
            <XStack
              pos="absolute"
              ai="center"
              jc="center"
              w={24}
              h={24}
              br={12}
              boc="$border"
              zIndex={999}
              bw={1}
              l={-12}
              t={0}
              bc="#131517"
            >
              <Text bold>{index + 1}</Text>
            </XStack>
            <YStack pb={32} pt={3} f={1}>
              {it}
            </YStack>
          </XStack>
        ))}
    </YStack>
  )
}
