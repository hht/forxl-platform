import _ from "lodash"
import { FC, Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { getWalletRecordDate } from "~/api/wallet"
import { Icon, Row, Text, XStack, YStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useStatementStore } from "~/hooks/useStore"
import { LANGUAGES } from "~/lib/constants"
import { dayjs } from "~/lib/utils"

export const RequestStatement: FC = () => {
  const { t } = useTranslation()
  const MONTHS = useMemo(() => dayjs.monthsShort(), [])
  const { data: dates } = useRequest(getWalletRecordDate)
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
      {_.keys(dates)?.map((year, index) => (
        <Fragment key={year}>
          <Text>{year}</Text>
          <Row fw="wrap">
            {dates?.[year]?.map((month, index) => (
              <Row
                key={month}
                gap="$sm"
                pb="$md"
                pr={32}
                onPress={() => {
                  useStatementStore.setState({
                    months: _.xor(useStatementStore.getState().months, [
                      `${year}-${month}`,
                    ]).filter((it) => it.startsWith(`${year}`)),
                  })
                }}
              >
                <Icon
                  name={
                    months?.includes(`${year}-${month}`)
                      ? "checkboxChecked"
                      : "checkbox"
                  }
                  size={20}
                />
                <Text>{MONTHS[parseInt(month) - 1]}</Text>
              </Row>
            ))}
          </Row>
        </Fragment>
      ))}
    </YStack>
  )
}
