import { router } from "expo-router"
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
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <Card p="$md" bc={toRGBA(colors.warning, 0.2)}>
            <YStack gap="$sm">
              <Text bold>{t("security.twoFactor")}</Text>
              <Text caption col="$secondary">
                {t("security.twoFactorDesc")}
              </Text>
            </YStack>
            <Separator />
            <XStack pt="$md" ai="center">
              <XStack ai="center" gap={12} f={1}>
                <Icon name="twoFactor" size={24} />
                <Text title>2FA</Text>
              </XStack>
              <XStack
                gap="$xs"
                onPress={() => {
                  router.push("/security/2fa")
                }}
              >
                <Text col="$warning">{t("security.notEnabled")}</Text>
                <Icon name="chevronRight" size={16} />
              </XStack>
            </XStack>
          </Card>
        </Moti>
      ) : null}
    </AnimatePresence>
  )
}
