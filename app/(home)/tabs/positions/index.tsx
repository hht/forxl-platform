import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, Text, XStack, YStack } from '~/components'
import { Linear } from '~/widgets/shared/shape'
import { WalletStatistics } from '~/widgets/shared/wallet-summary'

export default function Page() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const dict = t("positions", {
    returnObjects: true,
  })
  return (
    <YStack f={1}>
      <Linear />
      <WalletStatistics />
      <YStack f={1} gap="$sm">
        <Text subject m="$md">
          {dict.title}
        </Text>
        <XStack px="$md">
          <Tabs
            data={dict.tabs}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
          ></Tabs>
        </XStack>
      </YStack>
    </YStack>
  )
}
