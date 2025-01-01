import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { XStack } from "tamagui"

import { Button, Dialog, ListItem, Popup, Text, toast } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { clearCache, getCacheSize } from "~/lib/utils"

export const ClearCacheItem = () => {
  const { t } = useTranslation()
  const dict = t("settings", {
    returnObjects: true,
  })
  const [visible, setVisible] = useState(false)
  const { data, refresh } = useRequest(getCacheSize, {
    cacheKey: CACHE_KEY.CACHE_SIZE,
  })
  return (
    <Fragment>
      <ListItem
        title={dict.clearCache}
        onPress={() => setVisible(true)}
        addonAfter={<Text col="$secondary">{data ?? ""}</Text>}
      />
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
