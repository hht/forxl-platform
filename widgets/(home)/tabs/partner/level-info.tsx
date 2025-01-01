import BottomSheetBase from "@gorhom/bottom-sheet"
import { Fragment, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { XStack, YStack } from "tamagui"

import { format, LEVEL_COLORS } from "./utils"

import { BottomSheet, Card, Icon, Justified, Row, Text } from "~/components"
import { usePartnerStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"

export const LevelInfo = () => {
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const { currentLevel, currentConfig } = usePartnerStore((state) => ({
    currentLevel: state.currentLevel,
    currentConfig: state.config?.find((it) => it.level === state.currentLevel),
  }))

  const bonusSheetRef = useRef<BottomSheetBase>(null)
  return (
    <Fragment>
      <Card gap="$md" blw="$xs" blc={LEVEL_COLORS[currentLevel] ?? "#CCB6A0"}>
        <Row gap="$sm">
          <Text fow="700" col={LEVEL_COLORS[currentLevel]}>
            {dict.children[currentLevel]}
          </Text>
          <Text fow="700">{dict.benefits}</Text>
        </Row>
        <Justified>
          <Row gap="$xs">
            <Text col="$secondary">{t("partner.tradingBonus")}</Text>
            <XStack
              hitSlop={10}
              onPress={() => bonusSheetRef.current?.expand()}
            >
              <Icon name="info" size={12} />
            </XStack>
          </Row>
          <Text>
            {t("partner.perLotMoney", {
              money: format(currentConfig?.market ?? 0),
            })}
          </Text>
        </Justified>
        <Justified>
          <Text col="$secondary">{t("partner.minBonus")}</Text>
          <Text>
            {t("partner.perDayMoney", {
              money: format(currentConfig?.funds ?? 0),
            })}
          </Text>
        </Justified>
        <Text fow="700" mt={12} mb={1}>
          {t("partner.requirements")}
        </Text>
        <Justified>
          <Text col="$secondary">{t("partner.balance")}</Text>
          <Text>
            {t("partner.andAboveMoney", {
              money: format(currentConfig?.funds ?? 0),
            })}
          </Text>
        </Justified>
        <Justified>
          <Text col="$secondary">{dict.volume}</Text>
          <Text>
            {t("partner.andAboveMoney", {
              money: format(currentConfig?.market ?? 0),
            })}
          </Text>
        </Justified>
        {currentLevel ? (
          <Justified>
            <Text col="$secondary">{t("partner.teamStructure")}</Text>
            <Row gap="$xs">
              <Text>
                {t("partner.levenNumber", {
                  number: currentConfig?.offlineCount ?? 0,
                })}
              </Text>
              <Text style={{ color: LEVEL_COLORS[currentLevel - 1] }}>
                {dict.children[currentLevel - 1]}
              </Text>
            </Row>
          </Justified>
        ) : null}
      </Card>
      <BottomSheet
        ref={bonusSheetRef}
        title={dict.bonusDesc.title}
        onClose={() => {
          bonusSheetRef.current?.close()
        }}
      >
        <YStack px="$md" gap="$md" pb={bottom + 16}>
          {dict.bonusDesc.description.map((it, index) => (
            <Text key={index}>{it}</Text>
          ))}
        </YStack>
      </BottomSheet>
    </Fragment>
  )
}
