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
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_MUSICS_COUNT)
  if (data.value) {
    const totalNumber = data?.value?.musics.meta.pagination.total - 1
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
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_GET_TODAY_COMEBACK, {
    filters: {
      date: {
        eq: new Date().toISOString().split('T')[0],
        // eq: '2023-10-30',
      },
    },
  })
  if (data.value) {
    // @ts-ignore
    data.value.comebacks.data.map((comeback: any) => {
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

function getDaysUntil(dateString: string): number {
  const today = new Date()
  const futureDate = new Date(dateString)
  const timeDifference = futureDate.getTime() - today.getTime()
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
  return daysDifference
}

//if date in argument is today return true
function isToday(dateString: string): boolean {
  const today = new Date()
  const futureDate = new Date(dateString)
  return (
    today.getFullYear() === futureDate.getFullYear() &&
    today.getMonth() === futureDate.getMonth() &&
    today.getDate() === futureDate.getDate()
  )
}

onMounted(async () => {
  await getRandomMusics()
  await getTodayComebacks()
  await getLastRelease()
  await getLastArtistAdded()
  await getListComeback()
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
  <div class="container mx-auto pt-8 lg:px-10 lg:pt-12">
    <!-- Slider Block -->
    <ComebackSlider :newsToday="newsToday" class="pb-8 lg:pb-12" />
    <!-- Random Songs Block -->
    <div class="grid grid-cols-1 gap-5 px-5 pb-8 lg:grid-cols-2 lg:px-0 lg:pb-12">
      <div class="w-full rounded bg-quaternary p-3">
        <p class="pb-3 text-center text-xl font-bold">Discover Music</p>
        <div class="space-y-2">
          <MusicDisplay
            v-for="song in randomSongs"
            :key="song.id"
            :albumId="song.releases[0].id"
            :artistId="song.artists[0].id"
            :musicId="song.id"
            :musicName="song.name"
            :musicImage="song.images[2]"
            :artistName="song.artists[0].name"
            :albumName="song.releases[0].name"
            :duration="song.duration"
            :musicVideoId="song.videoId"
            class="w-full bg-quinary"
          />
        </div>
      </div>

      <div class="w-full rounded bg-quaternary p-3">
        <p class="pb-3 text-center text-xl font-bold">Comeback</p>
        <div class="space-y-2">
          <div
            v-for="comeback in comebackList"
            :key="comeback.id"
            class="overflow-hidden rounded bg-quinary text-xs"
          >
            <div class="flex w-full justify-between bg-secondary">
              <div class="flex gap-1">
                <p
                  class="p-1 px-1.5"
                  :class="
                    isToday(comeback.date)
                      ? 'bg-primary'
                      : 'bg-tertiary font-bold text-secondary'
                  "
                >
                  {{
                    isToday(comeback.date) ? 'Today' : `D-${getDaysUntil(comeback.date)}`
                  }}
                </p>
                <p class="p-1">{{ comeback.artist.name }}</p>
              </div>
              <p class="p-1 pr-3">
                {{ comeback.message }}
              </p>
            </div>
          </div>
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
