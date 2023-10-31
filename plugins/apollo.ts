export default defineNuxtPlugin((nuxtApp) => {
  const { STRAPI_KEY } = useRuntimeConfig()
  nuxtApp.hook('apollo:auth', ({ client, token }) => {
    // `client` can be used to differentiate logic on a per-client basis.

    // apply apollo client token
    token.value = STRAPI_KEY
  })
})
