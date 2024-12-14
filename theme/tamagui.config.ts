import { config } from "@tamagui/config/v3"
import { createTamagui, createTokens } from "tamagui" // or '@tamagui/core'

import { COLORS } from "~/constants"

export const tokens = createTokens({
  ...config.tokens,
  color: {
    ...config.tokens.color,
    ...COLORS,
  },
  size: {
    ...config.tokens.size,
    xs: 11,
    sm: 13,
    true: 13,
    md: 15,
    lg: 17,
  },
})

const appConfig = createTamagui({
  ...config,
  tokens,
})

export type AppConfig = typeof appConfig

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
