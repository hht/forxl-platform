import _ from "lodash"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Icon, Row, Text, XStack, YStack } from "~/components"
import { getDate } from "~/hooks/useLocale"
import { useStatementStore } from "~/hooks/useStore"
import { LANGUAGES } from "~/lib/constants"
import { dayjs } from "~/lib/utils"

export const RequestStatement: FC = () => {
  const { t } = useTranslation()
  const MONTHS = useMemo(() => dayjs.monthsShort(), [])
  const { months, language } = useStatementStore()
  return (
    <YStack px="$md" gap="$md">
      <Text col="$secondary">{t("wallet.statementLanguage")}</Text>
      <XStack fw="wrap" pb="$sm">
        {LANGUAGES.map((it) => (
          <Row
            key={it.value}
            gap="$sm"
            pb="$md"
            pr={32}
            onPress={() => {
              useStatementStore.setState({ language: it.value as string })
            }}
          >
            <Icon
              name={it.value === language ? "radioChecked" : "radio"}
              size={20}
            />
            <Text>{it.label}</Text>
          </Row>
        ))}
      </XStack>
      <Text col="$secondary">{t("wallet.selectChannel")}</Text>
      <XStack>
        <Row gap="$md" pb="$md">
          <Icon name="radioChecked" size={20} />
          <Text>{t("wallet.email")}</Text>
        </Row>
      </XStack>
      <Text col="$secondary">{t("wallet.selectMonth")}</Text>
      <Text>{getDate().year() - 1}</Text>
      <Row fw="wrap">
        {MONTHS.map((month, index) => (
          <Row
            key={month}
            gap="$sm"
            pb="$md"
            pr={32}
            onPress={() => {
              useStatementStore.setState({
                months: _.xor(useStatementStore.getState().months, [
                  `${getDate().year() - 1}-${index + 1}`,
                ]).filter((it) => it.startsWith(`${getDate().year() - 1}`)),
              })
            }}
          >
            <Icon
              name={
                months?.includes(`${getDate().year() - 1}-${index + 1}`)
                  ? "checkboxChecked"
                  : "checkbox"
              }
              size={20}
            />
            <Text>{month}</Text>
          </Row>
        ))}
      </Row>
      <Text>{getDate().year()}</Text>
      <Row fw="wrap">
        {_.times(getDate().month() + 1).map((index) => (
          <Row
            key={index}
            gap="$sm"
            pb="$md"
            pr={32}
            onPress={() => {
              useStatementStore.setState({
                months: _.xor(useStatementStore.getState().months, [
                  `${getDate().year()}-${index + 1}`,
                ]).filter((it) => it.startsWith(`${getDate().year()}`)),
              })
            }}
          >
            <Icon
              name={
                months?.includes(`${getDate().year()}-${index + 1}`)
                  ? "checkboxChecked"
                  : "checkbox"
              }
              size={20}
            />
            <Text>{MONTHS[index]}</Text>
          </Row>
        ))}
      </Row>
    </YStack>
  )
}
