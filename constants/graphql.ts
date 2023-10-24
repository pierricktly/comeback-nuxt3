const config = useRuntimeConfig()

export const GRAPHQL_ENDPOINT = config.public.STRAPI_URL + '/graphql'

export const GRAPHQL_QUERY_LATEST_ARTIST_CREATE = `
  query Query {
    artists(
      sort:"createdAt:desc"
      pagination: {
        limit: 8
      }
    ) {
      data {
        attributes {
          name
          images
          idYoutubeMusic
          createdAt
        }
        id
      }
    }
  }
`