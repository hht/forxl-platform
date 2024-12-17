import { config } from '@tamagui/config/v3'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui, createTokens } from 'tamagui'

import colors from '~/theme/colors'

const darkTheme = {
  ...config.tokens.color,
  ...colors,
}

export const tokens = createTokens({
  ...config.tokens,
  color: {
    ...config.tokens.color,
    ...colors,
  },
  size: {
    ...config.tokens.size,
    xs: 4,
    sm: 8,
    md: 16,
    true: 16,
    lg: 24,
  },
  space: {
    ...config.tokens.space,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radius: {
    ...config.tokens.radius,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
})

const appConfig = createTamagui({
  ...config,
  tokens,
  shorthands,
  themes: {
    dark: darkTheme,
    light: darkTheme,
  },
  defaultTheme: "dark",
  themeClassNameOnRoot: false,
})

export type AppConfig = typeof appConfig

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
