import promise from '@promise2/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt([
  ...promise({
    rules: {
      '@typescript-eslint/no-dynamic-delete': 'off',
      'vue/no-multiple-template-root': 'off'
    }
  }),
  {
    plugins: { 'better-tailwindcss': betterTailwindcss },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off'
    }
  }
])
