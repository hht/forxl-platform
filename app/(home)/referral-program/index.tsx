import { Stack } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView, XStack, YStack } from 'tamagui'

import { getBonusConfig, getPartnerConfig, getPartnerInfo } from '~/api/partner'
import {
    Button, Card, copyToClipboard, Figure, Icon, IconType, Statistics, StatisticsInfo, Text
} from '~/components'
import { useRequest } from '~/hooks/useRequest'
import { useFroxlStore, usePartnerStore } from '~/hooks/useStore'
import { formatDecimal } from '~/lib/utils'
import colors from '~/theme/colors'

const LEVEL_ICON: IconType[] = ["user", "pair", "group"]

const DEVICE_WIDTH = Dimensions.get("window").width

export default function Layout() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dict = t("referral", {
    returnObjects: true,
  })
  const { account } = useFroxlStore()
  const { partnerConfig } = usePartnerStore((state) => ({
    partnerConfig: state.config?.find((it) => it.level === state.partnerLevel),
  }))
  const { data } = useRequest(getPartnerInfo, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        currentLevel: data?.level,
        partnerLevel: data?.level,
      })
    },
  })
  const { data: bonus } = useRequest(getBonusConfig)
  useRequest(getPartnerConfig, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        config: data,
      })
    },
  })
  return (
    <YStack f={1}>
      <XStack pos="absolute" t={0} l={0} r={0}>
        <Figure name="grid" width={DEVICE_WIDTH} height={DEVICE_WIDTH} />
      </XStack>
      <Stack.Screen options={{ title: dict.title }} />
      <ScrollView f={1} px="$md" showsVerticalScrollIndicator={false}>
        <YStack py={24} ai="center" jc="center">
          <Figure name="giftBox" />
        </YStack>
        <YStack ai="center" jc="center" px="$lg" gap="$sm">
          <Text fos={20} lh={24} fow="900">
            {dict.invite}
          </Text>
          <Text fos={20} lh={24} fow="900">
            <Trans
              i18nKey="referral.bonus"
              values={{
                percent: 30,
              }}
              components={{
                1: <Text fos={20} lh={24} fow="900" col="$primary" />,
              }}
            ></Trans>
          </Text>
          <Text ta="center" col="$secondary">
            {t("referral.bonusDesc", { percent: 30 })}
          </Text>
        </YStack>
        <Card bc="$card" my="$lg">
          <XStack
            bbc="$border"
            w="100%"
            bbw={1}
            ai="center"
            jc="space-between"
            gap="$md"
            p="$md"
          >
            <Statistics label={dict.earned}>
              <XStack ai="center" gap="$sm">
                <Text fos={17} lh={20} fow="900">
                  {`$${formatDecimal(data?.earned ?? 0)}`}
                </Text>
                <Button mah={18} px={4} br={2} ai="center" jc="center">
                  <Text caption col="$background">
                    {t("action.query")}
                  </Text>
                </Button>
              </XStack>
            </Statistics>
            <Statistics
              label={dict.spillover}
              info={
                <YStack gap="$md">
                  <Text ta="center" subject fow="400">
                    {dict.spillover}
                  </Text>
                  <Text ta="center" lh={18} col="$secondary">
                    {dict.spilloverDesc}
                  </Text>
                </YStack>
              }
            >
              {`$${formatDecimal(0.45)}`}
            </Statistics>
          </XStack>
          <YStack gap="$md">
            <Text col="$secondary" caption>
              {dict.useCode}
            </Text>
            <XStack
              bc="$accent"
              br="$sm"
              p="$md"
              ai="center"
              jc="space-between"
            >
              <Text>{account?.inviteCode}</Text>
              <XStack
                onPress={() => {
                  copyToClipboard(account?.inviteCode!)
                }}
              >
                <Text col="$primary">{t("action.copy")}</Text>
              </XStack>
            </XStack>
            <Button size="$md">{dict.share}</Button>
          </YStack>
        </Card>
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
        <YStack py="$md">
          <Text subject>{dict.benefits.title}</Text>
          {LEVEL_ICON.map((it, index) => (
            <XStack
              key={index}
              py="$md"
              w="100%"
              ai="center"
              jc="space-between"
            >
              <Text col="$secondary">
                {t("referral.benefits.generation", { generation: index + 1 })}
              </Text>
              <Text>
                {t("referral.benefits.perLot", {
                  amount: formatDecimal(
                    bonus?.[
                      `generation${index + 1}` as
                        | "generation1"
                        | "generation2"
                        | "generation3"
                    ] ?? 0
                  ),
                })}
              </Text>
            </XStack>
          ))}
        </YStack>
        <XStack pb={bottom + 16}></XStack>
      </ScrollView>
    </YStack>
  )
}
