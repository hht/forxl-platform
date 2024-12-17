import { resources } from '~/lib/utils'

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"]
  }
}
