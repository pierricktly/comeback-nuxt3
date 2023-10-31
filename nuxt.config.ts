// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  ssr: false,

  runtimeConfig: {
    STRAPI_URL: process.env.STRAPI_URL,
    STRAPI_KEY: process.env.STRAPI_KEY,
  },

  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  build: {
    transpile: ['vue-toastification', '@vuepic/vue-datepicker'],
  },

  apollo: {
    autoImports: true,
    authType: 'Bearer',
    authHeader: 'Authorization',
    tokenStorage: 'cookie',
    proxyCookies: true,
    clients: {
      default: {
        tokenName: 'STRAPI_KEY',
        httpEndpoint: process.env.STRAPI_URL + '/graphql',
      },
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
})
