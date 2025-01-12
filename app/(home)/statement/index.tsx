import { useUnmount } from "ahooks"
import { Stack } from "expo-router"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { useStatementStore } from "~/hooks/useStore"
import { i18n } from "~/lib/utils"
import { Statement } from "~/widgets/(home)/statement/statement"

export default function Page() {
  const { t } = useTranslation()
  useUnmount(() => {
    useStatementStore.setState({
      current: 0,
      date: undefined,
      activeIndex: 0,
      months: [],
      language: i18n.language,
    })
  })
  return (
    <Fragment>
      <Stack.Screen options={{ title: t("wallet.statement") }} />
      <Statement />
    </Fragment>
  )
}
