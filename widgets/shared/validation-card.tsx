import { BottomSheetModal } from '@gorhom/bottom-sheet'
import SNSMobileSDK from '@sumsub/react-native-mobilesdk-module'
import { AnimatePresence } from 'moti'
import { FC, Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getAttestationFlag, getProfile, getSumSubToken } from '~/api/account'
import {
    BottomSheet, Button, Card, Dialog, Figure, Icon, Moti, Popup, Separator, Text, XStack, YStack
} from '~/components'
import { CACHE_KEY, request, useRequest } from '~/hooks/useRequest'
import { i18n, I18NResource } from '~/lib/utils'
import colors, { toRGBA } from '~/theme/colors'

export const getCertificationPrompt = (
  status: Certification["status"]
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

const launchSNSMobileSDK = async () => {
  // From your backend get an access token for the applicant to be verified.
  // The token must be generated with `levelName` and `userId`,
  // where `levelName` is the name of a level configured in your dashboard.
  //
  // The sdk will work in the production or in the sandbox environment
  // depend on which one the `accessToken` has been generated on.
  //
  const accessToken = await getSumSubToken()
  console.log("accessToken: " + accessToken)
  const snsMobileSDK = SNSMobileSDK.init(accessToken, () => {
    return getSumSubToken()
  })
    .withHandlers({
      // Optional callbacks you can use to get notified of the corresponding events
      onStatusChanged: (event: any) => {
        console.log(
          "onStatusChanged: [" +
            event.prevStatus +
            "] => [" +
            event.newStatus +
            "]"
        )
      },
      onLog: (event: any) => {
        console.log("onLog: [Idensic] " + event.message)
      },
    })
    .withDebug(true)
    .withLocale(i18n.language)
    .build()
  snsMobileSDK
    .launch()
    .then((result: any) => {
      console.log("SumSub SDK State: " + JSON.stringify(result))
    })
    .catch((err: any) => {
      console.log("SumSub SDK Error: " + JSON.stringify(err))
    })
    .finally(() => {
      getProfile()
    })
}

export const VerificationTrigger: FC<{ data?: Certification }> = ({ data }) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("security", {
    returnObjects: true,
  })
  const [visible, setVisible] = useState(false)
  const ref = useRef<BottomSheetModal>(null)
  const onPress = useCallback(() => {
    if (!data?.status || !["PROCESS", "RETRY", "FINAL"].includes(data.status)) {
      ref.current?.present()
    } else {
      setVisible(true)
    }
  }, [data?.status])
  if (!data) {
    return <ActivityIndicator />
  }

  return (
    <Fragment>
      <XStack gap="$xs" onPress={onPress}>
        <Text col={data?.status === "GREEN" ? "$primary" : "$warning"}>
          {t(getCertificationPrompt(data?.status) as any)}
        </Text>
        <Icon name="chevronRight" size={16} />
      </XStack>
      {["PROCESS", "RETRY", "FINAL"].includes(data.status) ? (
        <Popup visible={visible} onClose={() => setVisible(false)}>
          <Dialog br="$md">
            <YStack ai="center" gap={12}>
              <Figure
                name={data.status === "PROCESS" ? "processing" : "tip"}
                color={
                  data.status === "PROCESS" ? colors.background : colors.warning
                }
                width={88}
              />
              <Text subject mx={40} ta="center">
                {data.status === "PROCESS" ? dict.inProgress : dict.rejected}
              </Text>
              <Text col="$secondary" ta="center">
                {data.status === "PROCESS"
                  ? dict.inProgressDesc
                  : dict.rejectedDesc}
              </Text>
              {data.status === "PROCESS" ? null : (
                <Card jc="center" bc={toRGBA(colors.warning, 0.1)} p="$md">
                  <Text ta="center" col="$warning">
                    {dict.rejectReason}
                  </Text>
                  {data.tags.map((item, index) => (
                    <Text key={index} ta="center" col="$warning">
                      {item}
                    </Text>
                  ))}
                </Card>
              )}
            </YStack>
            <XStack w="100%" gap={12} pt={12}>
              <Button
                f={1}
                size="$md"
                type={data.status === "PROCESS" ? "accent" : "warning"}
                onPress={() => {
                  setVisible(false)
                  if (data.status !== "PROCESS") {
                    launchSNSMobileSDK()
                  }
                }}
              >
                {t(data.status === "PROCESS" ? "action.gotIt" : "action.retry")}
              </Button>
            </XStack>
          </Dialog>
        </Popup>
      ) : (
        <BottomSheet
          ref={ref}
          title={
            data.status === "GREEN"
              ? dict.certified.title
              : t("profile.identityVerification")
          }
        >
          <YStack>
            {data.status === "GREEN" ? (
              <YStack p="$md" pb={bottom + 16} gap={32}>
                <XStack>
                  <YStack f={1} gap="$md">
                    <XStack gap="$sm">
                      <Icon name="userCircle" size={16} />
                      <YStack gap="$sm">
                        <Text col="$secondary">{dict.certified.name}</Text>
                        <Text title>{data.name}</Text>
                      </YStack>
                    </XStack>
                    <XStack gap="$sm">
                      <Icon name="passport" size={16} />
                      <YStack gap="$sm">
                        <Text col="$secondary">
                          {dict.certified.typeOfDocument}
                        </Text>
                        <Text title>{data.typeOfDocument}</Text>
                      </YStack>
                    </XStack>
                    <XStack gap="$sm">
                      <Icon name="sn" size={16} />
                      <YStack gap="$sm">
                        <Text col="$secondary">
                          {dict.certified.certificateNumber}
                        </Text>
                        <Text title>{data.certificateNumber}</Text>
                      </YStack>
                    </XStack>
                  </YStack>
                  <Figure name="passed" width={110} />
                </XStack>
                <Button
                  type="accent"
                  onPress={() => {
                    ref.current?.dismiss()
                  }}
                >
                  {t("action.gotIt")}
                </Button>
              </YStack>
            ) : (
              <YStack px="$md" pb={bottom + 16} gap={32}>
                <YStack gap={12}>
                  <Text title>{dict.uncertified}</Text>
                  {dict.uncertifiedDesc.map((item, index) => (
                    <XStack key={index} gap="$sm">
                      <Icon name="checked" size={16} />
                      <Text col="$secondary">{item}</Text>
                    </XStack>
                  ))}
                </YStack>
                <Button
                  onPress={() => {
                    ref.current?.dismiss()
                    launchSNSMobileSDK()
                  }}
                >
                  {dict.getVerified}
                </Button>
              </YStack>
            )}
          </YStack>
        </BottomSheet>
      )}
    </Fragment>
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
              <VerificationTrigger data={profile.realName} />
            </XStack>
          </Card>
        </Moti>
      ) : null}
    </AnimatePresence>
  )
}
