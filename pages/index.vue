<script setup lang="ts">
import * as gQuery from '@/constants/graphql'

const newsToday = ref<any[]>([])
const randomSongs = ref<any[]>([])
const lastRelease = ref<any[]>([])
const lastArtistAdded = ref<any[]>([])

interface Artist {
  id: string
  name: string
  type?: string
  images: string[]
}

interface Comeback {
  id: string
  date: string
  message: string
  artist: Artist
}

interface Release {
  id: string
  idYoutubeMusic: string
  name: string
  type?: string
  date: string
  images: string[]
  artist: Artist
}

const getRandomMusics = async () => {
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_MUSICS_COUNT)

  if (data.value) {
    // @ts-ignore
    const totalNumber = data.value.musics.meta.pagination.total - 1
    const randomNumbers: number[] = []
    while (randomNumbers.length < 5) {
      const randomNumber = Math.floor(Math.random() * totalNumber)
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber)
      }
    }

    const songPromises = randomNumbers.map((randomNumber) => {
      return useAsyncQuery(gQuery.GRAPHQL_QUERY_GET_MUSICS_NUMBER, {
        start: randomNumber,
        limit: 1,
      })
    })

    const songResults = await Promise.all(songPromises)

    songResults.forEach((result) => {
      // @ts-ignore
      if (result.data.value?.musics.data[0]) {
        // @ts-ignore
        randomSongs.value.push(result.data.value.musics.data[0])
      }
    })
  }
}

const getTodayComebacks = async () => {
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_GET_TODAY_COMEBACK, {
    filters: {
      date: {
        eq: new Date().toISOString().split('T')[0],
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
  // TODO: get last release
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
  let cb = {} as Comeback

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
  let r = {} as Release

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
  let a = {} as Artist

  a.id = artist.id
  a.name = artist.attributes.name
  a.images = artist.attributes.images
  a.type = artist.attributes.type

  return a
}

onMounted(async () => {
  await getRandomMusics()
  await getTodayComebacks()
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
  <div class="container mx-auto space-y-5 lg:p-5">
    <ComebackSlider :newsToday="newsToday" />
    <div class="space-y-5 py-8">
      <p class="text-2xl font-bold">Artist Recently Added</p>
      <div
        class="remove-scrollbar flex gap-2 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between"
      >
        <CardObject
          v-for="artist in lastArtistAdded"
          :key="artist.id"
          :mainTitle="artist.name"
          :subTitle="artist.type == 'SOLO' ? 'Soloist' : 'Group'"
          :image="artist.images[0]"
          isArtist
        />
      </div>
    </div>
    <div class="space-y-5 py-8">
      <p class="text-2xl font-bold">Artist Recently Added</p>
      <div
        class="remove-scrollbar flex gap-2 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between"
      >
        <CardObject
          v-for="release in lastRelease"
          :key="release.id"
          :mainTitle="release.name"
          :subTitle="release.artist.name"
          :image="release.images[release.images.length - 1]"
        />
      </div>
    </div>
  </div>
</template>
