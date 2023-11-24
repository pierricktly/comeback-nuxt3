import type { Artist } from '~/types/artist'
import type { Release } from '~/types/release'
import type { Music } from '~/types/music'
import { GRAPHQL_QUERY_MUSICS_COUNT, GRAPHQL_QUERY_GET_MUSICS_BY_ID } from '@/constants/graphql'

export function useGeneralFunction() {
  const { $apollo: apollo } = useNuxtApp()
  const config = useRuntimeConfig()

  const formatArtistData = async (artistData: any) => {
    if (!artistData) return {} as Artist

    const { attributes } = artistData

    const artistTmp: Artist = {
      id: artistData.id,
      idYoutubeMusic: attributes.idYoutubeMusic || '',
      name: attributes.name,
      description: attributes.description || '',
      type: attributes.type,
      images: attributes.images || [],
      styles: attributes.styles || [],
      socials: attributes.socials || [],
      platforms: attributes.platforms || [],
      members: attributes.members ? await formatArray(attributes.members.data, formatArtistData) : [],
      groups: attributes.groups ? await formatArray(attributes.groups.data, formatArtistData) : [],
      releases: attributes.releases ? await formatArray(attributes.releases.data, formatReleaseData) : [],
    }

    return artistTmp
  }

  const formatReleaseData = async (releaseData: any) => {
    if (!releaseData) return {} as Release

    const { attributes } = releaseData

    const releaseTmp: Release = {
      id: releaseData.id,
      idYoutubeMusic: attributes.idYoutubeMusic,
      name: attributes.name,
      type: attributes.type,
      year: attributes.year,
      verified: attributes.verified,
      platforms: attributes.platforms || [],
      dateRelease: attributes.dateRelease,
      images: attributes.images || [],

      artists: attributes.artists ? await formatArray(attributes.artists.data, formatArtistData) : [],
      music: attributes.music ? await formatArray(attributes.music.data, formatMusicData) : [],
    }

    return releaseTmp
  }

  const formatMusicData = async (musicData: any) => {
    if (!musicData) return {} as Music

    const { attributes } = musicData

    const musicTmp: Music = {
      id: musicData.id,
      videoId: attributes.videoId,
      name: attributes.name,
      duration: attributes.duration,
      images: attributes.images || [],
      artists: attributes.artists ? await formatArray(attributes.artists.data, formatArtistData) : [],
      releases: attributes.releases ? await formatArray(attributes.releases.data, formatReleaseData) : [],
    }

    return musicTmp
  }

  const formatArray = async (array: any[], formatter: Function) => {
    return await Promise.all(array.map(async (item) => await formatter(item)))
  }

  const getVideoDetails = async (videoId: string, apiKey: string) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,status&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      return data.items && data.items.length ? data.items[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la vidéo:', error)
      return null
    }
  }

  const canVideoBeEmbedded = async (videoId: string, apiKey: string) => {
    const videoDetails = await getVideoDetails(videoId, apiKey)

    if (!videoDetails) {
      return false
    }

    const isEmbeddable = videoDetails.status.embeddable
    const hasRestriction = videoDetails.contentDetails.regionRestriction

    return isEmbeddable && !hasRestriction
  }

  const getRandomMusic = async (): Promise<any> => {
    if (!apollo) throw new Error('Apollo client is not initialized')

    let selectedMusic = null

    try {
      // @ts-ignore
      const response = await apollo.query({
        query: GRAPHQL_QUERY_MUSICS_COUNT,
      })
      const totalNumberSong = response.data.musics.meta.pagination.total - 1

      while (!selectedMusic) {
        const randomReleaseIndex = Math.floor(Math.random() * totalNumberSong)
        try {
          // @ts-ignore
          const responseMusicsQuery = await apollo.query({
            query: GRAPHQL_QUERY_GET_MUSICS_BY_ID,
            variables: {
              start: randomReleaseIndex,
              limit: 1,
            },
          })
          if (responseMusicsQuery.data.musics.data.length) {
            const music = await formatMusicData(responseMusicsQuery.data.musics.data[0])
            if (await canVideoBeEmbedded(music.videoId, config.public.YOUTUBE_API_KEY)) {
              selectedMusic = music
            }
          }
        } catch (e: any) {
          if (e.networkError) {
            console.error('Network error:', e.networkError)
          } else if (e.graphQLErrors) {
            e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
          } else {
            console.error('Error fetching posts:', e)
          }
        }
      }
    } catch (e: any) {
      if (e.networkError) {
        console.error('Network error:', e.networkError)
      } else if (e.graphQLErrors) {
        e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
      } else {
        console.error('Error fetching posts:', e)
      }
    }

    return selectedMusic
  }

  // return all function
  return {
    formatArtistData,
    formatReleaseData,
    formatMusicData,
    getRandomMusic,
  }
}
