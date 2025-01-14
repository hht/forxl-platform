import { router } from 'expo-router'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAttestationFlag } from '~/api/account'
import { Button, Dialog, Figure, Popup, Text, XStack, YStack } from '~/components'
import { PortalProvider } from '~/components/portal'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { waitFor } from '~/lib/utils'
import colors from '~/theme/colors'

export const TwoFactorNotifier: FC = () => {
  const { t } = useTranslation()
  const [visible, toggleVisible] = useState(false)
  useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
    onSuccess: (data) => {
      if (!data?.ga) {
        toggleVisible(true)
      }
    },
  })

  return (
    <PortalProvider>
      <Popup visible={visible} onClose={() => toggleVisible(false)}>
        <Dialog br="$md">
          <YStack ai="center" px="$md" gap={12}>
            <Figure name="suspension" width={148} color={colors.background} />
            <Text subject>{t("wallet.tips")}</Text>
            <Text col="$secondary" ta="center">
              {t("wallet.depositConfirmPrompt")}
            </Text>
          </YStack>
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
