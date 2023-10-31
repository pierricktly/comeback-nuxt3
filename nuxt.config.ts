// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  runtimeConfig: {
    STRAPI_URL: process.env.STRAPI_URL,
    STRAPI_KEY: process.env.STRAPI_KEY,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    // '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  build: {
    transpile: ['vue-toastification', '@vuepic/vue-datepicker'],
  },

  // apollo: {
  //   authType: 'Bearer',
  //   authHeader: 'Authorization',
  //   tokenStorage: 'cookie',
  //   clients: {
  //     default: {
  //       tokenName: 'STRAPI_KEY',
  //       httpEndpoint: process.env.STRAPI_URL + '/graphql',
  //     },
  //   },
  // },

  pinia: {
    autoImports: ['defineStore'],
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
})
