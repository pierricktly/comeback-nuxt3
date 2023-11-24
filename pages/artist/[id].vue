<script setup lang="ts">
import { GRAPHQL_QUERY_GET_ARTIST_BY_ID } from '@/constants/graphql'
import { type Artist } from '@/types/artist'
import { type Release } from '@/types/release'

const title = ref('Artist Page')
const description = ref('Artist')
const route = useRoute()
const { artistFetch, isAdmin, isLogin } = defineProps(['artistFetch', 'isAdmin', 'isLogin'])

const isFetchingArtist = ref(false)

const { $apollo: apollo } = useNuxtApp()

const { formatArtistData } = useGeneralFunction()

const artist = ref<Artist>({} as Artist)
const imageLoaded = ref(false)

onMounted(async () => {
  if (!apollo) throw new Error('Apollo client is not initialized')

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: GRAPHQL_QUERY_GET_ARTIST_BY_ID,
      variables: {
        artistId: route.params.id,
      },
    })
    const artistData = response.data.artist.data
    console.log('artistData', artistData)
    artist.value = await formatArtistData(artistData)
    isFetchingArtist.value = true
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

const memberList = computed(() => {
  // return only member who type is SOLO
  return artist.value.members?.filter((member) => member.type == 'SOLO')
})

const subunitList = computed(() => {
  // return only member who type is GROUP
  return artist.value.members?.filter((member) => member.type == 'GROUP')
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
    <section
      class="background-top relative h-[30vh] overflow-hidden bg-cover bg-no-repeat lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
    >
      <NuxtImg
        v-if="artist.images"
        :src="artist.images[artist.images.length - 1]"
        :alt="artist.name + '_back'"
        format="webp"
        loading="lazy"
        @load="imageLoaded = true"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 flex items-end p-5 transition-all duration-500 ease-in-out lg:py-10"
        :class="imageLoaded ? 'bg-secondary/60' : 'bg-quinary'"
      >
        <div class="w-full space-y-5 lg:container lg:mx-auto lg:px-5">
          <h1 v-if="artist.name" class="py-3 text-3xl font-semibold md:text-6xl lg:text-7xl">
            {{ artist.name }}
          </h1>
          <SkeletonDefault v-else class="h-14 w-80 rounded" />
          <div v-if="artist.platforms?.length" class="flex flex-wrap gap-1.5">
            <LazyComebackExternalLink
              v-for="platform in artist.platforms"
              :key="platform.link"
              :name="platform.name"
              :link="platform.link"
            />
          </div>
          <div v-else class="flex gap-2">
            <SkeletonDefault v-for="i in 3" :key="`skeleton_platforms_` + i" class="h-6 w-20 rounded" />
          </div>
          <div v-if="artist.socials?.length" class="flex flex-wrap gap-1.5">
            <LazyComebackExternalLink
              v-for="social in artist.socials"
              :key="social.link"
              :name="social.name"
              :link="social.link"
            />
          </div>
          <div v-else-if="artist.socials?.length < 1 && !artist.name" class="flex gap-2">
            <SkeletonDefault v-for="i in 3" :key="`skeleton_socials_` + i" class="h-6 w-20 rounded" />
          </div>
          <div>
            <NuxtLink :to="`/artist/edit/${artist.id}`" class="bg-secondary px-2 py-1 text-xs font-semibold uppercase">
              Edit Artist
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto space-y-8 p-5 py-8 lg:space-y-14 lg:py-14">
      <div v-if="!artist.name" class="space-y-2">
        <SkeletonDefault class="h-5 w-3/4 rounded" />
        <SkeletonDefault class="h-5 w-2/4 rounded" />
        <SkeletonDefault class="h-5 w-2/6 rounded" />
        <SkeletonDefault class="h-5 w-2/5 rounded" />
      </div>
      <!-- Description Block -->
      <p v-if="artist.description" class="max-w-6xl whitespace-pre-line leading-8">
        {{ artist.description }}
      </p>
      <!-- Releases Block -->
      <div v-if="artist.releases?.length" class="space-y-5 pb-8 lg:pb-12">
        <p class="pl-5 text-xl font-bold lg:pl-0">Releases</p>
        <section class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0">
          <CardObject
            v-for="release in artist.releases"
            :key="release.id"
            :mainTitle="release.name"
            :subTitle="artist.name"
            :artistId="artist.id"
            :image="release.images[2]"
            :object-link="`/release/${release.id}`"
          />
        </section>
      </div>
      <!-- Members Block -->
      <div v-if="memberList?.length" class="space-y-5 pb-8 lg:pb-12">
        <p class="pl-5 text-2xl font-bold lg:pl-0">Members</p>
        <section class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0">
          <CardObject
            v-for="member in memberList"
            :key="member.id"
            :mainTitle="member.name"
            :subTitle="member.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="member.images[2]"
            :object-link="`/artist/${member.id}`"
            isArtist
          />
        </section>
      </div>
      <!-- Subunits Block -->
      <div v-if="subunitList?.length" class="space-y-5 pb-8 lg:pb-12">
        <p class="pl-5 text-2xl font-bold lg:pl-0">Subunits</p>
        <section class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0">
          <CardObject
            v-for="subunit in subunitList"
            :key="subunit.id"
            :mainTitle="subunit.name"
            :subTitle="subunit.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="subunit.images[2]"
            :object-link="`/artist/${subunit.id}`"
            isArtist
          />
        </section>
      </div>
      <!-- Groups Block -->
      <div v-if="artist.groups?.length" class="space-y-5 pb-8 lg:pb-12">
        <p class="pl-5 text-2xl font-bold lg:pl-0">Groups</p>
        <section class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0">
          <CardObject
            v-for="group in artist.groups"
            :key="group.id"
            :mainTitle="group.name"
            :subTitle="group.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="group.images[2]"
            :object-link="`/artist/${group.id}`"
            isArtist
          />
        </section>
      </div>
    </section>
  </div>
</template>
