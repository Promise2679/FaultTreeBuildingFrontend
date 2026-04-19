// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  css: ['~/assets/main.css'],
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  fonts: { provider: 'bunny' },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],
  routeRules: { '/': { prerender: true } },
  ssr: false,
  ui: { colorMode: false },
  vite: {
    optimizeDeps: { include: ['@antv/x6', 'es-toolkit'] },
    server: { proxy: { '/api': { changeOrigin: true, target: process.env.PROXY_TARGET } } }
  }
})
