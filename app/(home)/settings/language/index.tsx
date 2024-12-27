import { Stack } from 'expo-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'tamagui'

import { Icon, ListItem } from '~/components'
import { useFroxlStore } from '~/hooks/useStore'
import { LANGUAGES } from '~/lib/constants'

export default function Layout() {
  const { t } = useTranslation()
  const language = useFroxlStore((state) => state.language)
  return (
    <Fragment>
      <Stack.Screen options={{ title: t("settings.language") }}></Stack.Screen>
      <ScrollView f={1} px="$md">
        {LANGUAGES.map((it) => (
          <ListItem
            title={it.label as string}
            key={it.value}
            onPress={() => {
              useFroxlStore.setState({ language: it.value as string })
            }}
            isLink={false}
            addonAfter={
              it.value === language ? (
                <Icon name="checked" size={16}></Icon>
              ) : null
            }
          />
        ))}
      </ScrollView>
    </Fragment>
  )
}
