import { Stack } from 'expo-router/stack'
import { TabList, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui'
import { forwardRef, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon, IconType, Text, YStack } from '~/components'
import colors from '~/theme/colors'

type TabButtonProps = TabTriggerSlotProps & {
  icon?: IconType
}

const Routes = [
  { name: "home", href: "/tabs/dashboard", icon: "home" },
  { name: "trade", href: "/tabs/trade", icon: "trade" },
  { name: "positions", href: "/tabs/positions", icon: "positions" },
  { name: "partner", href: "/tabs/partners", icon: "partner" },
  { name: "wallet", href: "/tabs/wallet", icon: "wallet" },
] as const

export const Tab = forwardRef(
  ({ icon, children, isFocused, onPress }: TabButtonProps, ref: Ref<View>) => {
    const { bottom } = useSafeAreaInsets()
    return (
      <YStack
        ref={ref}
        f={1}
        ai="center"
        jc="center"
        py={6}
        mb={bottom}
        onPress={onPress}
      >
        <Icon
          name={icon!}
          width={25}
          height={24}
          color={isFocused ? colors.primary : colors.secondary}
          accent={colors.primary}
        />
        <Text fos={10} color={isFocused ? "$primary" : "$secondary"}>
          {children}
        </Text>
      </YStack>
    )
  }
)

Tab.displayName = "Tab"

// Defining the layout of the custom tab navigator
export default function Layout() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <Stack.Screen options={{ headerShown: false }} />
      <TabSlot />
      <TabList style={styles.tabbar}>
        {Routes.map((route) => (
          <TabTrigger
            key={route.name}
            name={route.name}
            href={route.href}
            asChild
          >
            <Tab icon={route.icon}>{t(`tabs.${route.name}`)}</Tab>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: colors.background,
  },
})
