// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      STRAPI_URL: process.env.STRAPI_URL,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    // 'nuxt-vuefire',
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  build: {
    // vue-toastification - old commonjs module
    transpile: ['vue-toastification', '@vuepic/vue-datepicker'],
  },

  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: process.env.STRAPI_URL + '/graphql',
      },
    },
  },

  ssr: false,

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
