import gql from 'graphql-tag'

export const GRAPHQL_QUERY_LATEST_ARTIST_CREATE = gql`
  query Query {
    artists(sort: "createdAt:desc", pagination: { limit: 8 }) {
      data {
        attributes {
          name
          images
          idYoutubeMusic
          createdAt
          type
        }
        id
      }
    }
  }
`

export const GRAPHQL_QUERY_LATEST_RELEASE = gql`
  query Query {
    releases(sort: "dateRelease:desc", pagination: { limit: 8 }) {
      data {
        id
        attributes {
          name
          type
          images
          dateRelease
          year
          artists {
            data {
              id
              attributes {
                name
                images
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_MUSICS_COUNT = gql`
  query Pagination {
    musics {
      meta {
        pagination {
          total
          page
          pageCount
          pageSize
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_MUSICS_NUMBER = gql`
  query Pagination($start: Int, $limit: Int) {
    musics(pagination: { start: $start, limit: $limit }) {
      data {
        id
        attributes {
          videoId
          name
          duration
          releases {
            data {
              id
              attributes {
                name
                idYoutubeMusic
              }
            }
          }
          artists {
            data {
              id
              attributes {
                name
                images
                idYoutubeMusic
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_TODAY_COMEBACK = gql`
  query Query($filters: ComebackFiltersInput) {
    comebacks(filters: $filters) {
      data {
        id
        attributes {
          date
          message
          artist {
            data {
              id
              attributes {
                name
                images
              }
            }
          }
        }
      }
    }
  }
`
