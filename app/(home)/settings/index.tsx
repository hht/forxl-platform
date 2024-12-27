import BottomSheetBase from '@gorhom/bottom-sheet'
import { router, Stack } from 'expo-router'
import _ from 'lodash'
import { FC, Fragment, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { ScrollView, XStack } from 'tamagui'
import { createWithEqualityFn } from 'zustand/traditional'

import { BottomSheet, Button, Dialog, ListItem, Picker, Popup, Text, toast } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useFroxlStore } from '~/hooks/useStore'
import { LANGUAGES, TIMEZONES } from '~/lib/constants'
import { clearCache, getCacheSize } from '~/lib/utils'

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
  const [visible, setVisible] = useState(false)
  const { data, refresh } = useRequest(getCacheSize, {
    cacheKey: CACHE_KEY.CACHE_SIZE,
  })
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
        <ListItem
          title={dict.clearCache}
          onPress={() => setVisible(true)}
          addonAfter={<Text col="$secondary">{data ?? ""}</Text>}
        />
        <ListItem title={dict.about} />
        <ListItem
          title={dict.ver}
          isLink={false}
          addonAfter={<Text col="$secondary">v2.1456(23123213123)</Text>}
        />
      </ScrollView>
      <BottomSheet
        ref={timeSheetRef}
        onClose={() => timeSheetRef.current?.close()}
      >
        <Picker
          data={TIMEZONE_LIST}
          value={timezone}
          onValueChanged={(timezone) => {
            useFroxlStore.setState({ timezone: timezone as number })
          }}
        />
      </BottomSheet>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog ai="center" jc="center">
          <Text fos={20} lh={20}>
            {dict.clearCache}
          </Text>
          <Text col="$secondary" ta="center">
            {dict.clearCacheDesc}
          </Text>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$text" fow="700">
                {t("action.cancel")}
              </Text>
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={() => {
                clearCache()
                  .then(() => {
                    refresh()
                    toast.show(t("settings.clearCacheSuccess"))
                  })
                  .catch((error) => {
                    toast.show(error)
                  })
              }}
            >
              <Text col="$background" fow="700">
                {t("action.yes")}
              </Text>
            </Button>
          </XStack>
        </Dialog>
      </Popup>
    </Fragment>
  )
}
