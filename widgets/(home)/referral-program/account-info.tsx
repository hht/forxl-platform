import { Fragment } from "react"
import { Trans, useTranslation } from "react-i18next"
import { XStack, YStack } from "tamagui"

import { Icon, IconType, StatisticsInfo, Text } from "~/components"
import { usePartnerStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import colors from "~/theme/colors"

const LEVEL_ICON: IconType[] = ["user", "pair", "group"]

export const AccountInfo = () => {
  const { t } = useTranslation()
  const dict = t("referral", {
    returnObjects: true,
  })
  const { partnerConfig } = usePartnerStore((state) => ({
    partnerConfig: state.config?.find((it) => it.level === state.partnerLevel),
  }))
  return (
    <Fragment>
      <YStack gap={12}>
        <YStack gap={12}>
          <Text subject>{dict.requirements}</Text>
          <Text col="$secondary">
            <Trans
              i18nKey="referral.requirementsDesc"
              values={{ amount: formatDecimal(partnerConfig?.funds ?? 0) }}
              components={{
                1: <Text col="$primary" />,
              }}
            />
          </Text>
        </YStack>
        <XStack ai="center" gap="$sm">
          <Text subject>{dict.accounts}</Text>
          <StatisticsInfo>
            <YStack gap="$md">
              <Text ta="center" subject fow="400">
                {dict.activeUser}
              </Text>
              <Text ta="center" lh={18} col="$secondary">
                {t("referral.activeUserDesc", { amount: 100 })}
              </Text>
            </YStack>
          </StatisticsInfo>
        </XStack>
      </YStack>
      <YStack gap={12} py="$md">
        <XStack w="100%" ai="stretch">
          <YStack f={1} ai="flex-start" jc="flex-end">
            <Text col="$secondary">{dict.benefits.refer}</Text>
          </YStack>
          {LEVEL_ICON.map((icon, index) => (
            <YStack key={index} f={1} ai="center" jc="flex-end">
              <Text>{index + 1}</Text>
            </YStack>
          ))}
        </XStack>
        <XStack w="100%">
          <XStack
            pos="absolute"
            h={5}
            ai="center"
            jc="center"
            l={0}
            r={0}
            bc="$primary"
            br={5}
            transform={[{ translateY: 5 }]}
          />
          <YStack f={1} ai="center" jc="center">
            <XStack h={18}></XStack>
          </YStack>
          {LEVEL_ICON.map((icon, index) => (
            <YStack key={index} f={1} ai="center">
              <XStack
                w={18}
                h={18}
                ai="center"
                jc="center"
                bc="$primary"
                br={10}
              >
                <Icon name={icon} size={14} color={colors.background} />
              </XStack>
            </YStack>
          ))}
        </XStack>
        <XStack w="100%">
          <YStack f={1} ai="flex-start" jc="flex-start">
            <Text col="$secondary">{dict.benefits.earn}</Text>
          </YStack>
          {LEVEL_ICON.map((icon, index) => (
            <YStack key={index} f={1} ai="center" jc="flex-start">
              <Text ta="center">
                {t("referral.benefits.bonus", { generation: index + 1 })}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>
    </Fragment>
  )
}
