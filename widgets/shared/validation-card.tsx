import { AnimatePresence } from "moti"
import { FC } from "react"
import { useTranslation } from "react-i18next"

import { getAttestationFlag, getProfile } from "~/api/account"
import { Card, Icon, Moti, Separator, Text, XStack, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { I18NResource } from "~/lib/utils"
import colors, { toRGBA } from "~/theme/colors"

const getCertificationPrompt = (
  status: Certification["status"]
): I18NResource => {
  switch (status) {
    case "GREEN":
      return "settings.certificated"
    case "FINAL":
      return "settings.final"
    case "PROCESS":
      return "settings.process"
    case "INIT":
      return "settings.uncertified"
    case "RETRY":
      return "action.retry"
    default:
      return "settings.uncertified"
  }
}

export const VerificationCard: FC = () => {
  const { t } = useTranslation()
  const { data: profile } = useRequest(getProfile, {
    cacheKey: CACHE_KEY.USER,
  })
  const { data: attestation } = useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
  })
  const certificated = attestation?.kyc || profile?.realName?.status === "GREEN"
  return (
    <AnimatePresence>
      {attestation && !certificated && profile ? (
        <Moti
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card p="$md" bc={toRGBA(colors.warning, 0.2)}>
            <YStack gap="$sm">
              <Text fow="bold">{t("settings.passVerification")}</Text>
              <Text caption col="$secondary">
                {t("settings.passVerificationDesc")}
              </Text>
            </YStack>
            <Separator />
            <XStack pt="$md" ai="center">
              <XStack ai="center" gap={12} f={1}>
                <Icon name="creditCard" size={24} />
                <Text fos={15}>{t("profile.identityVerification")}</Text>
              </XStack>
              <XStack gap="$xs">
                <Text col="$warning">
                  {t(getCertificationPrompt(profile.realName.status) as any)}
                </Text>
                <Icon name="chevronRight" size={16} />
              </XStack>
            </XStack>
          </Card>
        </Moti>
      ) : null}
    </AnimatePresence>
  )
}
