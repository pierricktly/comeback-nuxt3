<script setup lang="ts">
import * as gQuery from '@/constants/graphql'
import type { Artist } from '@/types/artist'
import type { Comeback } from '@/types/comeback'
import type { Release } from '@/types/release'
import type { Music } from '@/types/music'

const { $apollo: apollo } = useNuxtApp()

const newsToday = ref<Partial<Comeback>[]>([])
const comebackList = ref<Partial<Comeback>[]>([])

// const {
//   data: dataComebacks,
//   pending: pendingComebacks,
//   error: errorComebacks,
// } = useAsyncData('dataComebacks', async () => {
//   console.log('Fetching comebacks - Start')
//   if (!apollo) throw new Error('Apollo client is not initialized')

//   try {
//     const response = await apollo.query({
//       query: gQuery.GRAPHQL_QUERY_GET_COMEBACK_AFTER_TODAY,
//     })

//     await getListComeback(response.data.comebacks.data)
//     console.log('Fetching comebacks - End', response.data.comebacks.data)
//     return response.data.comebacks.data
//   } catch (e: any) {
//     if (e.networkError) {
//       console.error('Network error:', e.networkError)
//     } else if (e.graphQLErrors) {
//       e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
//     } else {
//       console.error('Error fetching posts:', e)
//     }
//   }
// })

// const {
//   data: dataTodayComeback,
//   pending: pendingTodayComeback,
//   error: errorTodayComeback,
// } = useAsyncData('dataTodayComeback', async () => {
//   console.log('Fetching today comebacks - Start')
//   if (!apollo) throw new Error('Apollo client is not initialized')

//   try {
//     const response = await apollo.query({
//       query: gQuery.GRAPHQL_QUERY_GET_TODAY_COMEBACK,
//       variables: {
//         filters: {
//           date: {
//             eq: new Date().toISOString().split('T')[0],
//           },
//         },
//       },
//     })

//     await getTodayComebacks(response.data.comebacks.data)
//     console.log('Fetching today comebacks - End', response.data.comebacks.data)
//     return response.data.comebacks.data
//   } catch (e: any) {
//     if (e.networkError) {
//       console.error('Network error:', e.networkError)
//     } else if (e.graphQLErrors) {
//       e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
//     } else {
//       console.error('Error fetching posts:', e)
//     }
//   }
// })

const getListComeback = async (dtc: any) => {
  console.log('Processed comebackList', comebackList.value)
  // @ts-ignore
  dtc.map(async (comeback: any) => {
    await formatComebackObject(comeback).then((cb) => {
      console.log('cb', cb)
      comebackList.value.push(cb)
    })
  })
}

const getTodayComebacks = async (dtc: any) => {
  console.log('Processed newsToday', newsToday.value)
  // @ts-ignore
  dtc.map(async (comeback: any) => {
    await formatComebackObject(comeback).then((cb) => {
      newsToday.value.push(cb)
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

onMounted(async () => {
  if (!apollo) throw new Error('Apollo client is not initialized')

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: gQuery.GRAPHQL_QUERY_GET_COMEBACK_AFTER_TODAY,
    })

    await getListComeback(response.data.comebacks.data)
    console.log('Fetching comebacks - End', response.data.comebacks.data)
    return response.data.comebacks.data
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
    console.log('Fetching today comebacks - End', response.data.comebacks.data)
    return response.data.comebacks.data
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
    <div v-if="newsToday">
      <p>newsToday</p>
      <pre>{{ newsToday }}</pre>
    </div>
    <div v-else>
      <p>No data available for newsToday</p>
    </div>

    <div v-if="comebackList">
      <p>comebackList</p>
      <pre>{{ comebackList }}</pre>
    </div>
    <div v-else>
      <p>No data available for comebackList</p>
    </div>
  </div>
</template>
