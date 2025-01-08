import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { ScrollView, YStack } from '~/components'
import { AccountCard } from '~/widgets/shared/account-card'

export default function Page() {
  const { t } = useTranslation()
  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: t("wallet.deposit") }} />
      <YStack p="$md">
        <AccountCard />
      </YStack>
    </ScrollView>
  )
}
