<script setup lang="ts">
import * as gQuery from '@/constants/graphql'

const newsToday = ref<any[]>([])
const randomSongs = ref<any[]>([])
const lastRelease = ref<any[]>([])
const lastArtistAdded = ref<any[]>([])

interface Artist {
  id: string
  name: string
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
  date: string
  images: string[]
  artist: Artist
}

const getRandomMusics = async () => {
  const { data } = await useAsyncQuery(gQuery.GRAPHQL_QUERY_MUSICS_COUNT)

  if (data.value) {
    const totalNumber = data.value.musics.meta.pagination.total - 1
    // console.log('totalNumber', totalNumber)
    const randomNumbers: number[] = []
    while (randomNumbers.length < 5) {
      const randomNumber = Math.floor(Math.random() * totalNumber)
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber)
      }
    }
    // console.log('randomNumbers', randomNumbers)

    const songPromises = randomNumbers.map((randomNumber) => {
      return useAsyncQuery(gQuery.GRAPHQL_QUERY_GET_MUSICS_NUMBER, {
        start: randomNumber,
        limit: 1,
      })
    })

    const songResults = await Promise.all(songPromises)

    songResults.forEach((result) => {
      // console.log('result', result.data.value)
      if (result.data.value?.musics.data[0]) {
        randomSongs.value.push(result.data.value.musics.data[0])
      }
    })
    // console.log('randomSongs', randomSongs.value)
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
    data.value.releases.data.map((release: any) => {
      formatReleaseObject(release).then((r) => {
        lastRelease.value.push(r)
      })
    })
  }
}

const getLastArtistAdded = async () => {
  // TODO: get last artist added
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
  r.date = release.attributes.dateRelease
  r.images = release.attributes.images
  r.artist = {
    id: release.attributes.artists.data[0].id,
    name: release.attributes.artists.data[0].attributes.name,
    images: release.attributes.artists.data[0].attributes.images,
  }

  return r
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
  <div class="container p-5">
    <p>Hello World {{ newsToday.length }}</p>
    <section v-if="newsToday.length">
      <div class="relative">
        <div class="absolute z-10 pt-10">
          <p
            class="w-fit bg-red-700 py-1 pl-8 pr-5 text-xs font-semibold uppercase drop-shadow-lg lg:text-xl xl:text-2xl"
          >
            Comeback Today
          </p>
        </div>

        <Swiper
          :modules="[SwiperAutoplay, SwiperParallax]"
          :slides-per-view="1"
          :loop="true"
          :parallax="true"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
        >
          <SwiperSlide
            v-for="news in newsToday"
            :key="news.id"
            class="swiper-slide relative"
          >
            <NuxtImg
              :src="news.artist.images[news.artist.images.length - 1]"
              class="min-h-[20rem] w-full object-cover lg:max-h-[40rem]"
            />
            <NuxtLink
              :to="`/artist/${news.artist.id}`"
              class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/30 p-5"
            >
              <p
                class="self-center text-3xl font-bold lg:text-5xl xl:text-7xl 2xl:text-9xl"
              >
                {{ news.artist.name }}
              </p>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  </div>
</template>
