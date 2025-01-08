import { AnimatePresence } from "moti"
import { FC } from "react"
import { useTranslation } from "react-i18next"

import { getAttestationFlag } from "~/api/account"
import { Card, Icon, Moti, Separator, Text, XStack, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import colors, { toRGBA } from "~/theme/colors"

export const TwoFactorCard: FC = () => {
  const { t } = useTranslation()
  const { data: attestation } = useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
  })
  return (
    <AnimatePresence>
      {attestation && !attestation?.ga ? (
        <Moti
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card p="$md" bc={toRGBA(colors.warning, 0.2)}>
            <YStack gap="$sm">
              <Text fow="bold">{t("settings.twoFactor")}</Text>
              <Text caption col="$secondary">
                {t("settings.twoFactorDesc")}
              </Text>
            </YStack>
            <Separator />
            <XStack pt="$md" ai="center">
              <XStack ai="center" gap={12} f={1}>
                <Icon name="twoFactor" size={24} />
                <Text fos={15}>2FA</Text>
              </XStack>
              <XStack gap="$xs">
                <Text col="$warning">{t("settings.notEnabled")}</Text>
                <Icon name="chevronRight" size={16} />
              </XStack>
            </XStack>
          </Card>
        </Moti>
      ) : null}
    </AnimatePresence>
  )
}
