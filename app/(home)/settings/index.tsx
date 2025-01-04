import BottomSheetBase from '@gorhom/bottom-sheet'
import { router, Stack } from 'expo-router'
import _ from 'lodash'
import { Fragment, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { BottomSheet, ListItem, Picker, ScrollView, Text } from '~/components'
import { useFroxlStore } from '~/hooks/useStore'
import { LANGUAGES, TIMEZONES } from '~/lib/constants'
import { ClearCacheItem } from '~/widgets/(home)/settings/clear-cache'

const TIMEZONE_LIST = _.uniqBy(
  TIMEZONES.map((it) => ({
    label: it.timezone,
    value: it.value,
  })),
  "value"
).sort((a, b) => (a.value > b.value ? 1 : -1))

export default function Layout() {
  const { t } = useTranslation()
  const { timezone, language } = useFroxlStore((state) => state)
  const dict = t("settings", {
    returnObjects: true,
  })
  const utfOffset = useMemo(
    () => TIMEZONES.find((it) => it.value === timezone)?.timezone,
    [timezone]
  )
  const timeSheetRef = useRef<BottomSheetBase>(null)
  return (
    <Fragment>
      <Stack.Screen options={{ title: dict.title }}></Stack.Screen>
      <ScrollView f={1} px="$md">
        <ListItem
          title={dict.timeZone}
          addonAfter={<Text col="$primary">{utfOffset}</Text>}
          onPress={() => {
            timeSheetRef.current?.expand()
          }}
        />
        <ListItem
          title={dict.language}
          addonAfter={
            <Text col="$secondary">
              {LANGUAGES.find((it) => it.value === language)?.label ?? ""}
            </Text>
          }
          onPress={() => {
            router.push("/settings/language")
          }}
        />
        <ClearCacheItem />
        <ListItem title={dict.about} />
        <ListItem
          title={dict.ver}
          isLink={false}
          addonAfter={<Text col="$secondary">v2.1456(23123213123)</Text>}
        />
      </ScrollView>
      <BottomSheet ref={timeSheetRef} onClose={timeSheetRef.current?.close}>
        <Picker
          data={TIMEZONE_LIST}
          value={timezone}
          onValueChanged={(timezone) => {
            useFroxlStore.setState({ timezone: timezone as number })
          }}
        />
      </BottomSheet>
    </Fragment>
  )
}
