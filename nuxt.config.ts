// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  build: {
    transpile: ['vuetify']
  },
  css: [
    '~/assets/main.css',
    '~/assets/variabels.css',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],
  vite: {
    define: { 'process.env.DEBUG': false },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_BASE || 'http://localhost:4000/api'
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Droid+Sans&family=Poppins&display=swap'
        }
      ]
    }
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
})
