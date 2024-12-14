import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui"
import { forwardRef, Ref } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon, IconType, Text, YStack } from "~/components"
import { COLORS } from "~/constants"

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
        f={1}
        jc="space-between"
        ai="center"
        py={6}
        mb={bottom}
        onPress={onPress}
      >
        <Icon
          name={icon!}
          width={25}
          height={24}
          color={isFocused ? COLORS.primary : COLORS.secondary}
          accent={COLORS.primary}
        />
        <Text fos={10} color={isFocused ? "$primary" : "$secondary"}>
          {children}
        </Text>
      </YStack>
    )
  }
)
// Defining the layout of the custom tab navigator
export default function Layout() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabbar}>
        {Routes.map((route) => (
          <TabTrigger
            key={route.name}
            name={route.name}
            href={route.href}
            asChild
          >
            <TabButton icon={route.icon}>{t(`tabs.${route.name}`)}</TabButton>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: COLORS.background,
  },
})
