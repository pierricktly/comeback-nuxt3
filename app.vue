<script setup lang="ts">
import { GRAPHQL_QUERY_GET_ALL_ARTISTS } from '@/constants/graphql'
import type { Artist } from './types/artist'

// get token from runtime config
const { STRAPI_KEY } = useRuntimeConfig();

// init cookie for github token
const cookie = useCookie("STRAPI_KEY");

// set cookie value if not set
cookie.value = cookie.value || STRAPI_KEY;

const artistList = useArtistList()
const { formatArtistData } = useGeneralFunction()
const { data, error, refresh } = await useAsyncQuery(GRAPHQL_QUERY_GET_ALL_ARTISTS)
await data?.value?.artists?.data.map(async (artist) => {
  artistList.value.push(await formatArtistData(artist))
})
</script>

<template>
  <NuxtLayout>
    <div>
      <NuxtLoadingIndicator color="#9E0102" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<style>
/* Page Transitions - 0.4s Slide/Fade */
.page-enter-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-enter {
  opacity: 0;
}

.page-leave-active {
  opacity: 0;
}
</style>
