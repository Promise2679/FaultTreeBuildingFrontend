import promise from '@promise2/eslint-config'

import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(promise({ enable: { vue: true } }))
