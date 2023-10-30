<script setup lang="ts">
import * as gQuery from '@/constants/graphql'
import type { Artist } from '@/types/artist'
import type { Comeback } from '@/types/comeback'
import type { Release } from '@/types/release'
import type { Music } from '@/types/music'

const newsToday = ref<any[]>([])
const randomSongs = ref<any[]>([])
const lastRelease = ref<any[]>([])
const lastArtistAdded = ref<any[]>([])
const comebackList = ref<any[]>([])

const { data: dataRandomMusics } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_MUSICS_COUNT)
const { data: dataComebacks } = await useAsyncQuery(
  gQuery.GRAPHQL_QUERY_GET_COMEBACK_AFTER_TODAY,
  {
    filters: {
      date: {
        gt: new Date().toISOString().split('T')[0],
      },
    },
    sort: 'date:asc',
  },
)
const { data: dataTodayComeback } = await useAsyncQuery(
  gQuery.GRAPHQL_QUERY_GET_TODAY_COMEBACK,
  {
    filters: {
      date: {
        eq: new Date().toISOString().split('T')[0],
        // eq: '2023-10-30',
      },
    },
  },
)

const getListComeback = async () => {
  if (dataComebacks.value) {
    // @ts-ignore
    dataComebacks.value.comebacks.data.map((comeback: any) => {
      formatComebackObject(comeback).then((cb) => {
        // console.log('getListComeback -> cb', cb)
        comebackList.value.push(cb)
      })
    })
  }
}

const getRandomMusics = async () => {
  if (dataRandomMusics.value) {
    const totalNumber = dataRandomMusics?.value?.musics.meta.pagination.total - 1
    const randomNumbers: number[] = []
    while (randomNumbers.length < 5) {
      const randomNumber = Math.floor(Math.random() * totalNumber)
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber)
      }
    }

    const songPromises = randomNumbers.map((randomNumber) =>
      useAsyncQuery(gQuery.GRAPHQL_QUERY_GET_MUSICS_BY_ID, {
        start: randomNumber,
        limit: 1,
      }).then((result) => {
        return result?.data?.value?.musics?.data[0]
      }),
    )

    const songResults = await Promise.allSettled(songPromises)

    songResults.forEach(async (result) => {
      if (result.status === 'fulfilled' && result.value) {
        formatMusicObject(result.value)
      }
    })
  }
}

const getTodayComebacks = async () => {
  if (dataTodayComeback.value) {
    // @ts-ignore
    dataTodayComeback.value.comebacks.data.map((comeback: any) => {
      formatComebackObject(comeback).then((cb) => {
        newsToday.value.push(cb)
      })
    })
  }
}

const getLastRelease = async () => {
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_LATEST_RELEASE)
  if (data.value) {
    // @ts-ignore
    data.value.releases.data.map((release: any) => {
      formatReleaseObject(release).then((r) => {
        lastRelease.value.push(r)
      })
    })
  }
}

const getLastArtistAdded = async () => {
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_LATEST_ARTIST_CREATE)
  if (data.value) {
    // @ts-ignore
    data.value.artists.data.map((artist: any) => {
      formatArtistObject(artist).then((a) => {
        lastArtistAdded.value.push(a)
      })
    })
  }
}

const formatComebackObject = async (comeback: any) => {
  let cb: Partial<Comeback> = {}

  cb.id = comeback.id
  cb.date = comeback.attributes.date
  cb.message = comeback.attributes.message
  cb.artist = {
    id: comeback.attributes.artist.data.id,
    name: comeback.attributes.artist.data.attributes.name,
    images: comeback.attributes.artist.data.attributes.images,
  }

  return cb
}

const formatReleaseObject = async (release: any) => {
  let r: Partial<Release> = {}

  r.id = release.id
  r.idYoutubeMusic = release.attributes.idYoutubeMusic
  r.name = release.attributes.name
  r.type = release.attributes.type
  r.date = release.attributes.dateRelease
  r.images = release.attributes.images
  r.artist = {
    id: release.attributes.artists.data[0].id,
    name: release.attributes.artists.data[0].attributes.name,
    images: release.attributes.artists.data[0].attributes.images,
  }

  return r
}

const formatArtistObject = async (artist: any) => {
  let a: Partial<Artist> = {}

  a.id = artist.id
  a.name = artist.attributes.name
  a.images = artist.attributes.images
  a.type = artist.attributes.type

  return a
}

const formatMusicObject = async (music: any) => {
  let m: Partial<Music> = {}

  m.id = music.id
  m.name = music.attributes.name
  m.videoId = music.attributes.videoId
  m.duration = music.attributes.duration
  m.images = music.attributes.images
  m.artists = music.attributes.artists.data.map((artist: any) => {
    return {
      id: artist.id,
      name: artist.attributes.name,
      images: artist.attributes.images,
    }
  })
  m.releases = music.attributes.releases.data.map((release: any) => {
    return {
      id: release.id,
      name: release.attributes.name,
    }
  })

  randomSongs.value.push(m)
  return m
}

onMounted(async () => {
  await getTodayComebacks()
  await getRandomMusics()
  await getListComeback()
  await getLastRelease()
  await getLastArtistAdded()
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
    <ComebackSlider :newsToday="newsToday" class="pb-8 lg:pb-12" />
    <!-- Random Songs & Comeback Block -->
    <div class="grid grid-cols-1 gap-5 px-5 pb-8 md:px-0 lg:grid-cols-2 lg:pb-12">
      <!-- Random Songs Block -->
      <div class="w-full rounded bg-quaternary p-3">
        <p class="pb-3 text-center text-xl font-bold">Discover Music</p>
        <div v-if="randomSongs.length" class="space-y-2">
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
            :duration="song.duration"
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
