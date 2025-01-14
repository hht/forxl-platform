import { FC, Fragment, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, Popup, Text, XStack } from '~/components'

export const SupportTip: FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  const dict = t("profile.tips", {
    returnObjects: true,
  })
  return (
    <Fragment>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog>
          <Text subject>{dict.title}</Text>
          <Text col="$secondary">{dict.desc}</Text>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              size="$md"
              f={0.9}
              type="accent"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$text" bold>
                {t("action.cancel")}
              </Text>
            </Button>
            <Button
              f={1}
              size="$md"
              px={0}
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$background" bold>
                {dict.action}
              </Text>
            </Button>
          </XStack>
        </Dialog>
      </Popup>
      <XStack
        hitSlop={16}
        onPress={() => {
          setVisible(true)
        }}
      >
        {children}
      </XStack>
    </Fragment>
  )
}
