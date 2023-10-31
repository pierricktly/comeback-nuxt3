<script setup lang="ts">
import {
  GRAPHQL_QUERY_GET_RELEASE_BY_ID,
  GRAPHQL_QUERY_GET_RELEASES_BY_ARTIST_ID,
} from '@/constants/graphql'
import { type release } from '@/types/release'
import { type Release } from '@/types/release'

const title = ref('Release Page')
const description = ref('Release')
const route = useRoute()

const { formatReleaseData } = useGeneralFunction()

const release = ref<Release>({} as Release)
const artistRelease = ref<Release[]>([] as Release[])
const imageLoaded = ref(false)

const { data, error, refresh } = await useAsyncQuery(GRAPHQL_QUERY_GET_RELEASE_BY_ID, {
  releaseId: route.params.id,
}).catch((error: any) => {
  console.log(error)
})

if (data.value) {
  const releaseData = data.value.release.data
  release.value = await formatReleaseData(releaseData)

  const { data: artRelease } = await useAsyncQuery(
    GRAPHQL_QUERY_GET_RELEASES_BY_ARTIST_ID,
    {
      filters: {
        artists: {
          id: {
            eq: '51',
          },
        },
        not: {
          id: {
            eq: '688',
          },
        },
      },
    },
  ).catch((error: any) => {
    console.log(error)
  })
  console.log('artRelease', artRelease.value.releases.data)
  artRelease.value.releases.data.map(async (release: any) => {
    artistRelease.value.push(await formatReleaseData(release))
  })
  console.log('artistRelease', artistRelease.value)
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
    <!--  Header Release -->
    <section class="relative h-fit">
      <!-- Header Image -->
      <div class="relative h-fit min-h-[20rem] lg:max-h-[30rem] lg:min-h-[30rem]">
        <div
          class="absolute inset-0 min-h-[20rem] w-full transition-all duration-700 ease-in-out lg:max-h-[30rem] lg:min-h-[30rem]"
          :class="imageLoaded ? 'bg-black opacity-30' : ' bg-primary opacity-100'"
        />
        <NuxtImg
          v-if="release.images"
          format="webp"
          preload
          :src="release.images[release.images.length - 1]"
          :alt="release.name"
          @load="imageLoaded = true"
          class="max-h-[20rem] min-h-[20rem] w-full object-cover lg:max-h-[30rem] lg:min-h-[30rem]"
        />
      </div>
      <!-- Header Data-->
      <div
        class="z-10 flex flex-col justify-end space-y-3 p-5 transition-all duration-300 ease-in-out md:absolute md:inset-0 md:min-h-full md:justify-center md:bg-secondary/50"
      >
        <div class="container mx-auto flex items-center gap-5 space-y-2.5 lg:items-end">
          <NuxtImg
            v-if="release.images"
            format="webp"
            :alt="release.name"
            :src="release.images[release.images.length - 1]"
            class="hidden aspect-square max-w-[12rem] rounded md:block lg:max-w-[20rem]"
          />
          <Skeleton
            v-else
            class="hidden aspect-square min-w-[12rem] max-w-[12rem] rounded md:block lg:min-w-[20rem] lg:max-w-[20rem]"
          />
          <div class="mt-auto space-y-3">
            <!-- Data Fetched -->
            <div v-if="release.name" class="space-y-2">
              <h1 class="text-2xl font-black lg:text-5xl 2xl:text-7xl">
                {{ release.name }}
              </h1>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/artist/${release.artists[0].id}`"
                  class="flex items-center gap-2"
                >
                  <NuxtImg
                    :src="release.artists[0].images[0]"
                    :alt="release.artists[0].name"
                    class="h-3 w-3 rounded-full"
                  />
                  <p class="text-sm font-semibold text-gray-400">
                    {{ release.artists[0].name }}
                  </p>
                </NuxtLink>
                <p>-</p>
                <p>{{ release.type }}</p>
                <p>-</p>
                <p>{{ release.year }}</p>
              </div>
              <div class="space-y-2 text-xs">
                <p>1, 054, 258, 031 streams on Youtube Music</p>
                <p>1, 054, 258, 031 streams on Youtube Music</p>
                <p>1, 054, 258, 031 streams on Youtube Music</p>
              </div>
            </div>
            <!-- Skeleton -->
            <div v-else class="space-y-2.5">
              <Skeleton class="h-5 w-40 rounded-full" />
              <div class="flex gap-2">
                <Skeleton class="h-3 w-14 rounded" />
                <Skeleton class="h-3 w-14 rounded" />
                <Skeleton class="h-3 w-14 rounded" />
              </div>
              <Skeleton class="h-3 w-60 rounded-full" />
              <Skeleton class="h-3 w-60 rounded-full" />
              <Skeleton class="h-3 w-60 rounded-full" />
            </div>
            <!-- Buttons -->
            <div class="flex flex-wrap gap-2 text-xs">
              <NuxtLink
                :to="`/release/edit/` + release.id"
                class="w-20 bg-quaternary py-1 text-center hover:bg-quinary"
              >
                <p>Edit</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto space-y-12 p-5 py-10 xl:px-0">
      <!-- Skeleton -->
      <section v-if="!release.name" class="space-y-2">
        <Skeleton class="h-3 w-3/4 rounded-full" />
        <Skeleton class="h-3 w-full rounded-full" />
        <Skeleton class="h-3 w-full rounded-full" />
        <Skeleton class="h-3 w-3/4 rounded-full" />
        <Skeleton class="h-3 w-2/4 rounded-full" />
      </section>
      <!-- Platforms -->
      <section v-if="release.platforms.length" class="space-y-2">
        <p class="font-black">Streaming Platforms</p>
        <div class="flex gap-2">
          <ComebackExternalLink
            v-for="social in release.platforms"
            :key="social.name"
            :name="social.name"
            :link="social.link"
          />
        </div>
      </section>
      <!-- Musics -->
      <section v-if="release.music.length" class="space-y-2">
        <p class="font-black">Tracks</p>
        <div class="space-y-2">
          <MusicDisplay
            v-for="song in release.music"
            :key="song.id"
            :albumId="release.id"
            :albumName="release.name"
            :artistId="release.artists[0].id"
            :artistName="release.artists[0].name"
            :artistImage="release.artists[0].images[0]"
            :musicId="song.videoId"
            :musicName="song.name"
            :musicImage="song.images[2]"
            :duration="song.duration.toString()"
            class="w-full bg-quinary"
          />
        </div>
      </section>
      <!-- Release -->
      <section v-if="artistRelease.length" class="space-y-2">
        <p class="font-black">Other releases of {{ release.artists[0].name }}</p>
        <section
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
        >
          <CardObject
            v-for="artRelease in artistRelease"
            :key="artRelease.id"
            :mainTitle="artRelease.name"
            :subTitle="artRelease.type == 'ALBUM' ? 'ALBUM' : 'SINGLE'"
            :image="artRelease.images[artRelease.images.length - 1]"
            :object-link="`/release/${artRelease.id}`"
            isReleaseDisplay
          />
        </section>
      </section>
    </section>
  </div>
</template>
