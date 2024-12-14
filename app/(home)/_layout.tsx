import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui"
import { FC, forwardRef, Ref } from "react"
import { View, ViewProps } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { styled, Text, XStackProps } from "tamagui"

import { Icon, IconType, YStack } from "~/components"

type TabButtonProps = TabTriggerSlotProps & {
  icon?: IconType
}

const Routes = [
  { name: "home", href: "/", icon: "home" },
  { name: "trade", href: "/trade", icon: "trade" },
  { name: "positions", href: "/positions", icon: "positions" },
  { name: "partner", href: "/partner", icon: "partner" },
  { name: "wallet", href: "/wallet", icon: "wallet" },
] as const

export const TabButton = forwardRef(
  ({ icon, children, isFocused, onPress }: TabButtonProps, ref: Ref<View>) => {
    const { bottom } = useSafeAreaInsets()
    return (
      <YStack
        ref={ref}
        p="$3"
        jc="space-between"
        ai="center"
        mb={bottom}
        onPress={onPress}
      >
        <Icon name={icon!} />
        <Text
          color={isFocused ? "$red10" : "white"}
          fontSize="sm"
          fontWeight="bold"
        >
          {children}
        </Text>
      </YStack>
    )
  }
)
// Defining the layout of the custom tab navigator
export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={{ backgroundColor: "black" }}>
        {Routes.map((route) => (
          <TabTrigger
            key={route.name}
            name={route.name}
            href={route.href}
            asChild
          >
            <TabButton icon={route.icon}>{route.name}</TabButton>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  )
}
