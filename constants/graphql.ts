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

export const GRAPHQL_QUERY_GET_MUSICS_BY_ID = gql`
  query Pagination($start: Int, $limit: Int) {
    musics(pagination: { start: $start, limit: $limit }) {
      data {
        id
        attributes {
          videoId
          name
          images
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

export const GRAPHQL_QUERY_GET_COMEBACK_AFTER_TODAY = gql`
  query Query($filters: ComebackFiltersInput, $sort: [String]) {
    comebacks(filters: $filters, sort: $sort) {
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

export const GRAPHQL_QUERY_GET_ARTIST_BY_ID = gql`
  query Artist($artistId: ID) {
    artist(id: $artistId) {
      data {
        id
        attributes {
          name
          idYoutubeMusic
          description
          type
          verified
          styles
          socials
          platforms
          images
          members {
            data {
              id
              attributes {
                name
                type
                images
              }
            }
          }
          groups {
            data {
              id
              attributes {
                name
                type
                images
              }
            }
          }
          releases {
            data {
              id
              attributes {
                name
                dateRelease
                images
                type
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_ARTIST_BY_ID_FOR_EDIT = gql`
  query Artist($artistId: ID) {
    artist(id: $artistId) {
      data {
        id
        attributes {
          name
          idYoutubeMusic
          description
          type
          verified
          styles
          socials
          platforms
          images
          members {
            data {
              id
              attributes {
                name
                type
                images
              }
            }
          }
          groups {
            data {
              id
              attributes {
                name
                type
                images
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_ALL_ARTISTS = gql`
  query Query {
    artists(sort: "name:asc", pagination: { pageSize: 1000 }) {
      data {
        id
        attributes {
          name
          images
          idYoutubeMusic
          type
        }
      }
    }
  }
`

export const GRAPHQL_MUTATION_UPDATE_ARTIST = gql`
  mutation Mutation($data: ArtistInput!, $updateArtistId: ID!) {
    updateArtist(data: $data, id: $updateArtistId) {
      data {
        id
        attributes {
          name
          idYoutubeMusic
          images
          description
          type
          styles
          platforms
          socials
          groups {
            data {
              id
              attributes {
                name
                images
                type
              }
            }
          }
          members {
            data {
              id
              attributes {
                name
                images
                type
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_RELEASE_BY_ID = gql`
  query Query($releaseId: ID) {
    release(id: $releaseId) {
      data {
        id
        attributes {
          name
          idYoutubeMusic
          dateRelease
          type
          year
          platforms
          images
          artists {
            data {
              id
              attributes {
                name
                images
              }
            }
          }
          music {
            data {
              id
              attributes {
                name
                duration
                videoId
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_QUERY_GET_RELEASES_BY_ARTIST_ID = gql`
  query Query($filters: ReleaseFiltersInput) {
    releases(filters: $filters) {
      data {
        id
        attributes {
          name
          images
          type
        }
      }
    }
  }
`
