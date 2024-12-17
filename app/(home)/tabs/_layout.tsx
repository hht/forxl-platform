import { Stack, Tabs } from "expo-router"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Icon } from "~/components"
import colors from "~/theme/colors"

const Routes = [
  { name: "home", href: "dashboard", icon: "home" },
  { name: "trade", href: "trade", icon: "trade" },
  { name: "positions", href: "positions", icon: "positions" },
  { name: "partner", href: "partners", icon: "partner" },
  { name: "wallet", href: "wallet", icon: "wallet" },
] as const

const ScreenOptions = {
  tabBarActiveTintColor: colors.primary,
  headerShown: false,
}

export default function Layout() {
  const { t } = useTranslation()
  return (
    <Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs screenOptions={ScreenOptions}>
        {Routes.map(({ name, href, icon }) => (
          <Tabs.Screen
            key={name}
            name={href}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <Icon
                  name={icon!}
                  width={25}
                  height={24}
                  color={focused ? colors.primary : colors.secondary}
                  accent={colors.primary}
                />
              ),
              title: t(`tabs.${name}`),
            }}
          />
        ))}
      </Tabs>
    </Fragment>
  )
}
