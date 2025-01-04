import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { YStackProps } from 'tamagui'

import { Icon, Text, XStack, YStack } from '~/components'
import colors from '~/theme/colors'

const Prompt: FC<PropsWithChildren & { checked?: boolean }> = ({
  checked,
  children,
}) => {
  return (
    <XStack gap="$xs" ai="center">
      <Icon
        name="circleChecked"
        width={12}
        height={12}
        color={checked ? colors.primary : colors.tertiary}
      ></Icon>
      <Text caption col={checked ? "$primary" : "$tertiary"}>
        {children}
      </Text>
    </XStack>
  )
}

export const PasswordValidator: FC<YStackProps & { password?: string }> = ({
  password = "",
}) => {
  const { t } = useTranslation()
  const matches = t("anon.matches", {
    returnObjects: true,
  })
  return (
    <YStack gap="$sm">
      <Text caption>{matches.title}</Text>
      <Prompt checked={/.{8,12}/.test(password)}>{matches.length}</Prompt>
      <Prompt checked={/[0-9]/.test(password)}>{matches.containsNumber}</Prompt>
      <Prompt checked={/[!@#$%^&*_\-]/.test(password)}>
        {matches.containsSpecial}
      </Prompt>
      <Prompt checked={/[A-Za-z]/.test(password)}>
        {matches.containsLetter}
      </Prompt>
    </YStack>
  )
}
