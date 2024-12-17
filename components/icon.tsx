import { FC } from 'react'
import { SvgProps } from 'react-native-svg'

import * as icons from './assets'

import colors from '~/theme/colors'

type IconType = keyof typeof icons

type Props = {
  name: IconType
  size?: number
} & SvgProps & { accent?: string }

const Icon: FC<Props> = (props: Props) => {
  const { name, color, size = 24, ...rest } = props

  // eslint-disable-next-line import/namespace
  const IconComponent = icons[name]

  return (
    <IconComponent
      color={color ?? colors.secondary}
      width={size}
      height={size}
      {...rest}
    />
  )
}

Icon.displayName = "Icon"

export { Icon, type IconType }
