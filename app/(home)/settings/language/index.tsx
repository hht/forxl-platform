import { Stack } from 'expo-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon, ListItem, ScrollView } from '~/components'
import { useFroxlStore } from '~/hooks/useStore'
import { LANGUAGES } from '~/lib/constants'
import { dayjs, i18n } from '~/lib/utils'

export default function Layout() {
  const { t } = useTranslation()
  const language = useFroxlStore((state) => state.language)
  return (
    <Fragment>
      <Stack.Screen options={{ title: t("settings.language") }}></Stack.Screen>
      <ScrollView f={1} px="$md" showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((it) => (
          <ListItem
            title={it.label as string}
            key={it.value}
            onPress={() => {
              i18n.changeLanguage(it.value as string)
              dayjs.locale(it.value as string)
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
