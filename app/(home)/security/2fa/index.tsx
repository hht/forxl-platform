import { router, Stack, useFocusEffect } from "expo-router"
import { useTranslation } from "react-i18next"
import { ActivityIndicator } from "react-native"

import { getAttestationFlag } from "~/api/account"
import { Figure, ListItem, Switch, Text, YStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useGoogleAuthStore } from "~/hooks/useStore"
import colors from "~/theme/colors"

export default function Page() {
  const { t } = useTranslation("translation")

  const { data, loading, refresh } = useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
  })
  useFocusEffect(refresh)
  return (
    <YStack p="$md" pt={32} f={1} ai="center" gap={24}>
      <Stack.Screen options={{ title: t("security.twoFactor") }} />
      <YStack gap="$xs" ai="center">
        <Figure name="authenticator" color={colors.destructive} width={100} />
        <Text col="$secondary" ta="center">
          {t("settings.authenticatorDesc")}
        </Text>
      </YStack>
      <YStack w="100%">
        <ListItem
          title={t("security.twoFactor")}
          onPress={() => {
            if (data) {
              router.push(`/security/2fa/${data?.ga ? "disable" : "enable"}`)
            }
          }}
          addonAfter={
            loading ? (
              <ActivityIndicator />
            ) : (
              <Switch
                checked={data?.ga}
                disabled
                disabledOpacity={1}
                onCheckedChange={() => {
                  if (data) {
                    router.push(
                      `/security/2fa/${data?.ga ? "disable" : "enable"}`
                    )
                  }
                }}
              />
            )
          }
          isLink={false}
        />
        <ListItem
          title={t("security.changeTwoFactor")}
          disabled={!data?.ga}
          onPress={() => {
            if (data?.ga) {
              useGoogleAuthStore.setState({ checkCode: "", code: "" })
              router.push("/security/2fa/change")
            }
          }}
          isLink
        />
      </YStack>
    </YStack>
  )
}
