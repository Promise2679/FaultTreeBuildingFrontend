// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line nuxt/nuxt-config-keys-order
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        commaDangle: 'never'
      }
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],
  routeRules: { '/': { prerender: true } },
  ssr: false
})
