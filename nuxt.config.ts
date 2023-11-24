// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  plugins: ['~/plugins/apollo-client.js'],

  runtimeConfig: {
    public: {
      STRAPI_URL: process.env.STRAPI_URL,
      STRAPI_KEY: process.env.STRAPI_KEY,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    },
    STRAPI_URL: process.env.STRAPI_URL,
    STRAPI_KEY: process.env.STRAPI_KEY,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  build: {
    transpile: ['vue-toastification', '@vuepic/vue-datepicker'],
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
})
