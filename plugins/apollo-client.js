// plugins/apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const httpLink = createHttpLink({
    uri: config.public.STRAPI_URL, // Remplacez par votre URL GraphQL
  })

  const cache = new InMemoryCache()

  const apolloClient = new ApolloClient({
    link: httpLink,
    key: config.public.STRAPI_KEY,
    cache,
  })

  nuxtApp.provide('apollo', apolloClient)
})
