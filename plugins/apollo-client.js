// plugins/apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const httpLink = createHttpLink({
    uri: config.public.STRAPI_URL, // Remplacez par votre URL GraphQL
  })

  const authLink = setContext((_, { headers }) => {
    const token = config.public.STRAPI_KEY
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const link = authLink.concat(httpLink)

  const cache = new InMemoryCache()

  const apolloClient = new ApolloClient({
    link: link,
    cache,
  })

  nuxtApp.provide('apollo', apolloClient)
})
