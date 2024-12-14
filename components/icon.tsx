import { FC } from "react"
import { SvgProps } from "react-native-svg"

import * as icons from "./assets"

type IconType = keyof typeof icons

type Props = {
  name: IconType
} & SvgProps

const Icon: FC<Props> = (props: Props) => {
  const { name, ...rest } = props

  const IconComponent = icons[name]

  return <IconComponent {...rest} />
}

Icon.displayName = "Icon"

export { Icon, type IconType }
