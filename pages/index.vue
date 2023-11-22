<script setup lang="ts">
import * as gQuery from '@/constants/graphql'
import type { Artist } from '@/types/artist'
import type { Comeback } from '@/types/comeback'
import type { Release } from '@/types/release'
import type { Music } from '@/types/music'

const { $apollo: apollo } = useNuxtApp()

const newsToday = ref<Partial<Comeback>[]>([])
const comebackList = ref<Partial<Comeback>[]>([])
const randomSongs = ref<Partial<Music>[]>([])
const lastArtistAdded = ref<Partial<Artist>[]>([])
const lastRelease = ref<Partial<Release>[]>([])

const getListComeback = async (dtc: any) => {
  // @ts-ignore
  dtc.map(async (comeback: any) => {
    await formatComebackObject(comeback).then((cb) => {
      comebackList.value.push(cb)
    })
  })
}

const getTodayComebacks = async (dtc: any) => {
  // @ts-ignore
  dtc.map(async (comeback: any) => {
    await formatComebackObject(comeback).then((cb) => {
      newsToday.value.push(cb)
    })
  })
}

const getRandomSongs = async (dtc: any) => {
  // @ts-ignore
  dtc.map(async (song: any) => {
    await formatMusicObject(song).then((cb) => {
      randomSongs.value.push(cb)
    })
  })
}

const getArtistAdded = async (dtc: any) => {
  // @ts-ignore
  dtc.map(async (artist: any) => {
    await formatArtistObject(artist).then((cb) => {
      lastArtistAdded.value.push(cb)
    })
  })
}

const getRecentRelease = async (dtc: any) => {
  // @ts-ignore
  dtc.map(async (release: any) => {
    await formatReleaseObject(release).then((cb) => {
      lastRelease.value.push(cb)
    })
  })
}

async function formatComebackObject(comeback: any): Promise<Partial<Comeback>> {
  let artist = comeback.attributes?.artist?.data
  let cb: Partial<Comeback> = {
    id: comeback.id,
    date: comeback.attributes?.date,
    message: comeback.attributes?.message,
    artist: artist
      ? {
          id: artist.id,
          name: artist.attributes?.name,
          images: artist.attributes?.images,
        }
      : undefined,
  }
  return cb
}

async function formatMusicObject(music: any): Promise<Partial<Music>> {
  let artist = music.attributes?.artists?.data[0]
  let release = music.attributes?.releases?.data[0]
  let song: Partial<Music> = {
    id: music.id,
    name: music.attributes?.name,
    videoId: music.attributes?.videoId,
    duration: music.attributes?.duration,
    images: music.attributes?.images,
    artists: artist
      ? [
          {
            id: artist.id,
            name: artist.attributes?.name,
            images: artist.attributes?.images,
            idYoutubeMusic: release.attributes?.idYoutubeMusic,
          },
        ]
      : [],
    releases: release
      ? [
          {
            id: release.id,
            name: release.attributes?.name,
            idYoutubeMusic: release.attributes?.idYoutubeMusic,
          },
        ]
      : [],
  }
  return song
}

async function formatArtistObject(artist: any): Promise<Partial<Artist>> {
  let artistObject: Partial<Artist> = {
    id: artist.id,
    name: artist.attributes?.name,
    images: artist.attributes?.images,
    type: artist.attributes?.type,
  }
  return artistObject
}

async function formatReleaseObject(release: any): Promise<Partial<Release>> {
  let artist = release.attributes?.artists?.data[0]
  let releaseObject: Partial<Release> = {
    id: release.id,
    name: release.attributes?.name,
    images: release.attributes?.images,
    artist: artist
      ? {
          id: artist.id,
          name: artist.attributes?.name,
          images: artist.attributes?.images,
        }
      : undefined,
  }
  return releaseObject
}

onMounted(async () => {
  if (!apollo) throw new Error('Apollo client is not initialized')

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_MUSICS_COUNT,
    })
    const totalNumberSong = response.data.musics.meta.pagination.total - 1
    const randomNumberSelected: any[] = []
    while (randomNumberSelected.length < 5) {
      const randomNumber = Math.floor(Math.random() * totalNumberSong)
      if (!randomNumberSelected.includes(randomNumber)) {
        randomNumberSelected.push(randomNumber)
        try {
          // @ts-ignore
          const responseMusicsQuery = await apollo.query({
            query: gQuery.GRAPHQL_QUERY_GET_MUSICS_BY_ID,
            variables: {
              start: randomNumber,
              limit: 1,
            },
          })
          await getRandomSongs(responseMusicsQuery.data.musics.data)
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

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_GET_COMEBACK_AFTER_TODAY,
      variables: {
        filters: {
          date: {
            gt: new Date().toISOString().split('T')[0],
          },
        },
        sort: 'date:asc',
      },
    })

    await getListComeback(response.data.comebacks.data)
  } catch (e: any) {
    if (e.networkError) {
      console.error('Network error:', e.networkError)
    } else if (e.graphQLErrors) {
      e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
    } else {
      console.error('Error fetching posts:', e)
    }
  }

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_GET_TODAY_COMEBACK,
      variables: {
        filters: {
          date: {
            eq: new Date().toISOString().split('T')[0],
          },
        },
      },
    })

    await getTodayComebacks(response.data.comebacks.data)
  } catch (e: any) {
    if (e.networkError) {
      console.error('Network error:', e.networkError)
    } else if (e.graphQLErrors) {
      e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
    } else {
      console.error('Error fetching posts:', e)
    }
  }

  try {
    // @ts-ignore
    const responseArtistCreate = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_LATEST_ARTIST_CREATE,
    })

    await getArtistAdded(responseArtistCreate.data.artists.data)
  } catch (e: any) {
    if (e.networkError) {
      console.error('Network error:', e.networkError)
    } else if (e.graphQLErrors) {
      e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
    } else {
      console.error('Error fetching posts:', e)
    }
  }

  try {
    // @ts-ignore
    const responseRecentRelease = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_LATEST_RELEASE,
    })
    console.log('responseRecentRelease', responseRecentRelease.data.releases.data)
    await getRecentRelease(responseRecentRelease.data.releases.data)
    console.log('lastRelease', lastRelease.value)
  } catch (e: any) {
    if (e.networkError) {
      console.error('Network error:', e.networkError)
    } else if (e.graphQLErrors) {
      e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
    } else {
      console.error('Error fetching posts:', e)
    }
  }
})

useHead({
  title: 'Comeback',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    {
      name: 'robots',
      content: 'noindex,nofollow',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      hid: 'description',
      name: 'description',
      content:
        "Don't miss any Comeback. Track every next release by your favorite artists.",
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: 'Comeback - Track every next release by your favorite artists.',
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'website',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: 'Comeback - Track every next release by your favorite artists.',
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content:
        "Don't miss any Comeback. Track every next release by your favorite artists.",
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: 'https://nuxt-firebase-auth.vercel.app/',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://nuxt-firebase-auth.vercel.app/ogp.png',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <div class="container mx-auto lg:px-10">
    <!-- Slider Block -->
    <ComebackSlider v-if="newsToday" :newsToday="newsToday" class="pb-8 lg:pb-12" />
    <!-- Random Songs & Comeback Block -->
    <div class="grid grid-cols-1 gap-5 px-5 pb-8 md:px-0 lg:grid-cols-2 lg:pb-12">
      <!-- Random Songs Block -->
      <div class="w-full rounded bg-quaternary p-3">
        <p class="pb-3 text-center text-xl font-bold">Discover Music</p>
        <div v-if="randomSongs.length > 4" class="space-y-2">
          <MusicDisplay
            v-for="song in randomSongs"
            :key="song.id"
            :albumId="song.releases[0].id"
            :albumName="song.releases[0].name"
            :artistId="song.artists[0].id"
            :artistName="song.artists[0].name"
            :artistImage="song.artists[0].images[0]"
            :musicId="song.videoId"
            :musicName="song.name"
            :musicImage="song.images[2]"
            :duration="song.duration?.toString()"
            class="w-full bg-quinary"
          />
        </div>
        <div v-else class="space-y-2">
          <Skeleton v-for="i in 5" class="h-10 w-full rounded" />
        </div>
      </div>
      <!-- Comeback Block -->
      <div class="w-full rounded bg-quaternary p-3">
        <p class="pb-3 text-center text-xl font-bold">Comeback</p>
        <div v-if="comebackList.length" class="space-y-2">
          <CardComeback
            v-for="comeback in comebackList"
            :key="comeback.id"
            :date="comeback.date"
            :artistName="comeback.artist.name"
            :message="comeback.message"
            :artistId="comeback.artist.id"
          />
        </div>
        <div v-else class="space-y-2">
          <Skeleton v-for="i in 10" class="h-5 w-full rounded" />
        </div>
      </div>
    </div>
    <!-- Artist Added Block -->
    <div class="space-y-5 pb-8 lg:pb-12">
      <p class="pl-5 text-2xl font-bold lg:pl-0">Artist Added</p>
      <section
        v-if="lastArtistAdded.length"
        class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
      >
        <CardObject
          v-for="artist in lastArtistAdded"
          :key="artist.id"
          :mainTitle="artist.name"
          :subTitle="artist.type == 'SOLO' ? 'Soloist' : 'Group'"
          :image="artist.images[0]"
          :object-link="`/artist/${artist.id}`"
          isArtist
        />
      </section>
      <section
        v-else
        class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
      >
        <div
          v-for="n in 8"
          class="min-w-[10rem] max-w-[10rem] space-y-3 rounded bg-quaternary p-4 2xl:min-w-[11rem] 2xl:max-w-[11rem]"
        >
          <Skeleton :key="n" class="aspect-square w-full rounded-full" />
          <div class="space-y-3">
            <Skeleton class="h-4 w-full rounded-full" />
            <Skeleton class="h-4 w-3/4 rounded-full" />
          </div>
        </div>
      </section>
    </div>
    <!-- Recent Releases Block -->
    <div class="space-y-5 pb-8 lg:pb-12">
      <p class="pl-5 text-2xl font-bold lg:pl-0">Recent Releases</p>
      <section
        v-if="lastArtistAdded.length && lastRelease.length"
        class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
      >
        <CardObject
          v-for="release in lastRelease"
          :key="release.id"
          :mainTitle="release.name"
          :subTitle="release.artist.name"
          :artistId="release.artist.id"
          :image="release.images[2]"
          :object-link="`/release/${release.id}`"
        />
      </section>
      <section
        v-else
        class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
      >
        <div
          v-for="n in 8"
          class="min-w-[10rem] max-w-[10rem] space-y-3 rounded bg-quaternary p-4 2xl:min-w-[11rem] 2xl:max-w-[11rem]"
        >
          <Skeleton :key="n" class="aspect-square w-full rounded" />
          <div class="space-y-3">
            <Skeleton class="h-4 w-full rounded-full" />
            <Skeleton class="h-4 w-3/4 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
