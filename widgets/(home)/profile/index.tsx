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
          <Text fos={20} lh={20}>
            {dict.title}
          </Text>
          <Text col="$secondary">{dict.desc}</Text>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$text" fow="700">
                {t("action.cancel")}
              </Text>
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$background" fow="700">
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
