import { AnimatePresence } from 'moti'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { getAttestationFlag, getProfile } from '~/api/account'
import { Card, Icon, Moti, Separator, Text, XStack, YStack } from '~/components'
import { CACHE_KEY, useRequest } from '~/hooks/useRequest'
import { useKYCStore } from '~/hooks/useStore'
import { I18NResource, uuid } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'

export const getCertificationPrompt = (
  status?: Certification["status"]
): I18NResource => {
  switch (status) {
    case "GREEN":
      return "security.certificated"
    case "FINAL":
      return "security.final"
    case "PROCESS":
      return "security.process"
    case "RETRY":
      return "action.retry"
    default:
      return "profile.unCertified"
  }
}

export const VerificationTrigger: FC<{
  data?: Certification
}> = ({ data }) => {
  const { t } = useTranslation()
  if (!data) {
    return <ActivityIndicator />
  }
  return (
    <XStack
      onPress={async () => {
        useKYCStore.setState({ refreshKey: uuid() })
      }}
    >
      <XStack gap="$xs">
        <Text col={data?.status === "GREEN" ? "$primary" : "$warning"}>
          {t(getCertificationPrompt(data?.status) as any)}
        </Text>
        <Icon name="chevronRight" size={16} />
      </XStack>
    </XStack>
  )
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
              <Text bold>{t("security.passVerification")}</Text>
              <Text caption col="$secondary">
                {t("security.passVerificationDesc")}
              </Text>
            </YStack>
            <Separator />
            <XStack pt="$md" ai="center">
              <XStack ai="center" gap={12} f={1}>
                <Icon name="creditCard" size={24} />
                <Text title>{t("profile.identityVerification")}</Text>
              </XStack>
              <VerificationTrigger
                data={profile.realName}
              ></VerificationTrigger>
            </XStack>
          </Card>
        </Moti>
      ) : null}
    </AnimatePresence>
  )
}
