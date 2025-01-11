import _ from "lodash"
import { FC, Fragment, ReactNode, useState } from "react"
import { useTranslation } from "react-i18next"
import { XStack, XStackProps, YStack, YStackProps } from "tamagui"

import { Button } from "./button"
import { Icon } from "./icon"
import { Popup } from "./popup"
import { Text } from "./text"
import { Dialog } from "./view"

export const StatisticsInfo: FC<XStackProps> = ({ children, ...rest }) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  return (
    <Fragment>
      <XStack {...rest} hitSlop={10} onPress={() => setVisible(true)}>
        <Icon name="info" size={16} />
      </XStack>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog>
          {children}
          <Button size="$md" type="accent" onPress={() => setVisible(false)}>
            {t("action.gotIt")}
          </Button>
        </Dialog>
      </Popup>
    </Fragment>
  )
}

const StatisticsBase: FC<
  YStackProps & {
    label: string
    info?: ReactNode
  }
> = ({ label, children, info, ...rest }) => {
  return (
    <YStack gap="$sm" {...rest}>
      <XStack ai="center" gap="$xs">
        <Text col="$secondary">{label}</Text>
        {info ? <StatisticsInfo>{info}</StatisticsInfo> : null}
      </XStack>
      {_.isString(children) ? (
        <Text heading bold>
          {children}
        </Text>
      ) : (
        children
      )}
    </YStack>
  )
}

export const Statistics = Object.assign(StatisticsBase, {
  Info: StatisticsInfo,
})
