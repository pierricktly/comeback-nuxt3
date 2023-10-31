<script setup lang="ts">
import { GRAPHQL_QUERY_GET_RELEASE_BY_ID } from '@/constants/graphql'
import { type Artist } from '@/types/artist'
import { type Release } from '@/types/release'

const title = ref('Release Page')
const description = ref('Release')
const route = useRoute()

const { formatReleaseData } = useGeneralFunction()

const release = ref<Release>({} as Release)
const imageLoaded = ref(false)

const { data } = await useAsyncQuery(GRAPHQL_QUERY_GET_RELEASE_BY_ID, {
  releaseId: route.params.id,
}).catch((error: any) => {
  console.log(error)
})

if (data.value) {
  const releaseData = data.value.release.data
  release.value = await formatReleaseData(releaseData)
}

onMounted(async () => {
  title.value = release.value.name + ' by ' + release.value.artists[0].name
  description.value = release.value.name + ' by ' + release.value.artists[0].name
})

useHead({
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
})
</script>

<template>
  <div>
    <!--  Header Artist -->
    <div class="relative h-fit">
      <!-- Header Image -->
      <div class="relative h-fit min-h-[20rem] lg:max-h-[30rem] lg:min-h-[30rem]">
        <div
          class="absolute inset-0 min-h-[20rem] w-full bg-primary transition-all duration-700 ease-in-out lg:max-h-[30rem] lg:min-h-[30rem]"
          :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
        />
        <NuxtImg
          v-if="release.images"
          format="webp"
          preload
          :src="release.images[release.images.length - 1]"
          :alt="release.name"
          @load="imageLoaded = true"
          class="min-h-[20rem] w-full object-cover lg:max-h-[30rem] lg:min-h-[30rem]"
        />
      </div>
    </div>
  </div>
</template>
