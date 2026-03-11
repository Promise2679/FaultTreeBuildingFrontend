// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  routeRules: { '/': { prerender: true } },
  ssr: false
})
