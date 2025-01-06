import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { format, LEVEL_COLORS } from "./utils"

import { Card, Icon, Justified, Row, Text, XStack } from "~/components"
import { usePartnerStore, usePromptStore } from "~/hooks/useStore"
import { uuid } from "~/lib/utils"

export const LevelInfo = () => {
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const { currentLevel, currentConfig } = usePartnerStore((state) => ({
    currentLevel: state.currentLevel,
    currentConfig: state.config?.find((it) => it.level === state.currentLevel),
  }))

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
              onPress={() => {
                usePromptStore.setState({
                  title: dict.bonusDesc.title,
                  desc: dict.bonusDesc.description,
                  reloadKey: uuid(),
                })
              }}
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
    </Fragment>
  )
}
