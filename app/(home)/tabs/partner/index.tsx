import { Stack } from 'expo-router'
import { AnimatePresence } from 'moti'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Figure, Moti, Screen, ScrollView, Text, XStack, YStack } from '~/components'
import { usePartnerStore } from '~/hooks/useStore'
import { AccountInfo } from '~/widgets/(home)/tabs/partner/account-info'
import { LevelCard } from '~/widgets/(home)/tabs/partner/level-card'
import { LevelInfo } from '~/widgets/(home)/tabs/partner/level-info'
import { format, Level } from '~/widgets/(home)/tabs/partner/utils'
import {
  BrandTitle, DefaultScreenOptions, NativeStackNavigationOptions
} from '~/widgets/shared/header'
import { Gradient } from '~/widgets/shared/shape'

const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerTitle: () => <BrandTitle />,
  headerLeft: () => null,
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerRight: () => null,
}

export default function Page() {
  const { t } = useTranslation()
  const ref = useRef<ScrollView>(null)
  const dict = t("partner", {
    returnObjects: true,
  })
  const { currentLevel, partnerLevel, config } = usePartnerStore((state) => ({
    activeIndex: state.activeIndex,
    partnerLevel: state.partnerLevel,
    currentLevel: state.currentLevel,
    currentConfig: state.config?.find((it) => it.level === state.currentLevel),
    config: state.config,
  }))

  return (
    <Screen px={0} gap={0} pb={0}>
      <Stack.Screen options={ScreenOptions} />
      <Gradient />
      <ScrollView f={1} px="$md" showsVerticalScrollIndicator={false}>
        <AccountInfo />
        <AnimatePresence>
          {config && (
            <Moti
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
            >
              <YStack>
                <YStack py="$md" gap={12}>
                  <Text col="$secondary">{t("partner.level")}</Text>
                  <XStack w="100%" ai="center" jc="space-between">
                    <XStack
                      pos="absolute"
                      l={0}
                      r={0}
                      t={8}
                      h="$xs"
                      bc="$border"
                    ></XStack>
                    {dict.children.map((it, index) => (
                      <YStack
                        ai="center"
                        jc="center"
                        key={index}
                        f={1}
                        gap="$xs"
                      >
                        <YStack>
                          <XStack h={24} w={32} ai="center" jc="center">
                            <Figure
                              name={
                                index === partnerLevel
                                  ? "triangleL"
                                  : "triangleS"
                              }
                              width={index === partnerLevel ? 32 : 24}
                              height={index === partnerLevel ? 28 : 20}
                            ></Figure>
                          </XStack>
                          {index === partnerLevel ? (
                            <XStack
                              pos="absolute"
                              l={0}
                              r={0}
                              t={0}
                              b={0}
                              ai="center"
                              jc="center"
                            >
                              <Text bold mb={8} fos={10}>
                                {index}
                              </Text>
                            </XStack>
                          ) : null}
                        </YStack>
                        <Text caption>
                          {format(config?.[index].market ?? 0)}
                        </Text>
                      </YStack>
                    ))}
                  </XStack>
                </YStack>
                <ScrollView
                  ref={ref}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <XStack
                    gap="$sm"
                    py="$md"
                    onLayout={() =>
                      ref.current?.scrollTo({
                        x: 148 * (partnerLevel ?? 0),
                        animated: true,
                      })
                    }
                  >
                    {dict.children.map((it, index) => (
                      <LevelCard
                        level={index as Level}
                        key={index}
                        locked={index > partnerLevel}
                        active={index === currentLevel}
                      />
                    ))}
                  </XStack>
                </ScrollView>
                <LevelInfo />
                <XStack h="$md"></XStack>
              </YStack>
            </Moti>
          )}
        </AnimatePresence>
      </ScrollView>
    </Screen>
  )
}
