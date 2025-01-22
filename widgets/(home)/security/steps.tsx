import { useUnmount } from "ahooks"
import { FC, ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { getGaInfo } from "~/api/account"
import {
  copyToClipboard,
  Image,
  Stepper,
  Text,
  XStack,
  YStack,
} from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"

export const Steps: FC<{ children?: ReactNode }> = ({ children }) => {
  const { t } = useTranslation("translation")
  const { data } = useRequest(getGaInfo, {
    cacheKey: CACHE_KEY.GOOGLE_AUTH,
  })
  useUnmount(() => {
    useGoogleAuthStore.setState({ code: "", checkCode: "" })
  })
  return (
    <Stepper>
      <Text col="$secondary">{t("security.twoFactorStepOne")}</Text>
      {children}
      <YStack gap="$md">
        <Text col="$secondary">{t("security.twoFactorStepTwo")}</Text>
        <YStack ai="center" gap="$md">
          <XStack p={10} w={110} h={110} bc="white" br="$sm">
            {data?.secret ? (
              <Image
                source={`data:image/png;base64,${data?.pngStr}` as any}
                w={90}
                h={90}
              ></Image>
            ) : null}
          </XStack>
          <YStack gap="$sm" ai="center">
            <Text title ta="center">
              {data?.secret}
            </Text>
            <XStack
              hitSlop={16}
              onPress={() => {
                copyToClipboard(data?.secret)
              }}
            >
              <Text title col="$primary">
                {t("security.twoFactorCopy")}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </YStack>
      <Text col="$secondary">{t("security.twoFactorStepThree")}</Text>
    </Stepper>
  )
}
