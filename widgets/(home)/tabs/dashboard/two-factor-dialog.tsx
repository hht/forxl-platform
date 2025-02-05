import { router } from "expo-router"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"

import { Banners, CAROUSEL_WIDTH } from "./banners"

import { getAttestationFlag } from "~/api/account"
import { getBanners } from "~/api/dashboard"
import {
  Button,
  Dialog,
  Figure,
  Icon,
  Popup,
  Text,
  XStack,
  YStack,
} from "~/components"
import { PortalProvider } from "~/components/portal"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { waitFor } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

export const TwoFactorNotifier: FC = () => {
  const { t } = useTranslation()
  const [banner, setBanner] = useState({
    visible: false,
    fetched: false,
  })
  const [visible, toggleVisible] = useState(false)
  const { data } = useRequest(() => getBanners(1), {
    cacheKey: `${CACHE_KEY.BANNERS}.${1}`,
    onSuccess: (data) => {
      setBanner({
        visible: data?.length > 0,
        fetched: true,
      })
    },
  })
  useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
    ready: banner.fetched && !banner.visible,
    onSuccess: (data) => {
      if (!data?.ga) {
        toggleVisible(true)
      }
    },
  })

  return (
    <PortalProvider>
      <Popup
        visible={banner.visible}
        style={{ width: CAROUSEL_WIDTH, padding: 0 }}
        onClose={() => {
          setBanner({ ...banner, visible: false })
        }}
      >
        <Banners position={1} />
        <XStack
          pos="absolute"
          r={8}
          t={24}
          hitSlop={16}
          onPress={() => {
            setBanner({ ...banner, visible: false })
          }}
        >
          <Icon
            name="close"
            size={16}
            color={colors.text}
            onPress={() => setBanner({ ...banner, visible: false })}
          />
        </XStack>
      </Popup>
      <Popup visible={visible} onClose={() => toggleVisible(false)}>
        <Dialog br="$md">
          <YStack ai="center" px="$md" gap={12}>
            <Figure name="suspension" width={148} color={colors.background} />
            <Text subject>{t("security.twoFactorPrompt")}</Text>
            <Text col="$secondary" ta="center">
              {t("security.twoFactorDescription")}
            </Text>
          </YStack>
          <XStack
            bc={toRGBA(colors.primary, 0.1)}
            w="100%"
            px={12}
            py="$sm"
            br="$xs"
          >
            <Text col="$primary">{t("security.twoFactorMemo")}</Text>
          </XStack>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                toggleVisible(false)
              }}
            >
              {t("home.later")}
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={async () => {
                toggleVisible(false)
                await waitFor(200)
                router.push("/security/2fa/enable")
              }}
            >
              {t("home.enable2FA")}
            </Button>
          </XStack>
        </Dialog>
      </Popup>
    </PortalProvider>
  )
}
