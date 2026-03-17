import promise from '@promise2/eslint-config'

import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(promise({ rules: { 'vue/no-multiple-template-root': 'off' } }))
