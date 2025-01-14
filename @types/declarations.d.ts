declare module "*.svg" {
import React from 'react'
import { SvgProps } from 'react-native-svg'

    const content: React.FC<SvgProps & { accent?: string }>
  export default content
}

declare module "@sumsub/react-native-mobilesdk-module"
