import { useUnmount } from "ahooks"
import { router, Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { createWithEqualityFn } from "zustand/traditional"

import { deleteAccount } from "~/api/account"
import {
  Button,
  Card,
  Figure,
  Icon,
  Screen,
  Text,
  toast,
  XStack,
  YStack,
} from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useFroxlStore } from "~/hooks/useStore"
import colors, { toRGBA } from "~/theme/colors"

interface Store {
  agreed: boolean
}

const INITIAL = {
  agreed: false,
}

export const useStore = createWithEqualityFn<Store>()((set) => INITIAL)

export default function Page() {
  const { agreed } = useStore()

  const { t } = useTranslation("translation")

  const { run, loading } = useRequest(deleteAccount, {
    manual: true,
    onSuccess: () => {
      toast.show(t("settings.deleteAccountSuccess"))
      useFroxlStore.setState({ account: undefined, userNumber: undefined })
    },
  })
  useUnmount(() => {
    useStore.setState(INITIAL)
  })
  return (
    <Screen gap={32}>
      <Stack.Screen options={{ title: t("settings.deactivation") }} />
      <YStack pt={80} f={1} ai="center" gap="$md">
        <Figure name="tip" color={colors.destructive} width={95} />
        <Text subject mx={40} ta="center">
          {t("settings.deactivationTitle")}
        </Text>
        <Card bc={toRGBA(colors.destructive, 0.1)}>
          <Text col="$secondary">{t("settings.deactivationDesc")}</Text>
          <Text col="$destructive">{t("settings.deactivationPrompt")}</Text>
        </Card>
      </YStack>
      <YStack gap="$md">
        <XStack
          gap="$sm"
          onPress={() => {
            useStore.setState({ agreed: !agreed })
          }}
          ai="center"
        >
          <Icon name={agreed ? "agreed" : "notAgreed"} size={24} />
          <Text col="$secondary" caption>
            {t("settings.deactivationAgreement")}
          </Text>
        </XStack>
        <Button
          type="destructive"
          disabled={!agreed}
          isLoading={loading}
          onPress={run}
        >
          {t("settings.deleteAccount")}
        </Button>
        <Button type="accent" onPress={router.back}>
          {t("action.cancel")}
        </Button>
      </YStack>
    </Screen>
  )
}
