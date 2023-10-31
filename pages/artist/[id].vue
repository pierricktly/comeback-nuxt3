<script setup lang="ts">
import { GRAPHQL_QUERY_GET_ARTIST_BY_ID } from '@/constants/graphql'
import { type Artist } from '@/types/artist'
import { type Release } from '@/types/release'

const title = ref('Artist Page')
const description = ref('Artist')
const route = useRoute()

const artist = ref<Artist>({} as Artist)
const imageLoaded = ref(false)

const { data } = await useAsyncQuery(GRAPHQL_QUERY_GET_ARTIST_BY_ID, {
  // artistId: '34',
  artistId: route.params.id,
}).catch((error: any) => {
  console.log(error)
})

const getArtistData = async () => {
  if (data.value) {
    artist.value.id = data.value.artist.data.id
    artist.value.name = data.value.artist.data.attributes.name
    artist.value.description = data.value.artist.data.attributes.description
    artist.value.type = data.value.artist.data.attributes.type
    artist.value.images = data.value.artist.data.attributes.images
    artist.value.styles = data.value.artist.data.attributes.styles
    artist.value.socials = data.value.artist.data.attributes.socials
    artist.value.platforms = data.value.artist.data.attributes.platforms
    //for each member use formatArtistObject to have a list in artist.value.members
    artist.value.members = await Promise.all(
      data.value.artist.data.attributes.members.data.map(async (member: any) => {
        return await formatArtistObject(member)
      }),
    )
    //for each group use formatArtistObject to have a list in artist.value.groups
    artist.value.groups = await Promise.all(
      data.value.artist.data.attributes.groups.data.map(async (group: any) => {
        return await formatArtistObject(group)
      }),
    )
    //for each release use formatReleaseObject to have a list in artist.value.releases
    artist.value.releases = await Promise.all(
      data.value.artist.data.attributes.releases.data.map(async (release: any) => {
        return await formatReleaseObject(release)
      }),
    )
  }
}

const formatArtistObject = async (artist: any) => {
  let a = {} as Artist

  a.id = artist.id
  a.name = artist.attributes.name
  a.images = artist.attributes.images
  a.type = artist.attributes.type

  return a
}

const formatReleaseObject = async (release: any) => {
  let r = {} as Release

  r.id = release.id
  r.name = release.attributes.name
  r.type = release.attributes.type
  r.dateRelease = release.attributes.dateRelease
  r.images = release.attributes.images

  return r
}

onMounted(async () => {
  await getArtistData()
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
    <!--  Header Artist -->
    <div class="relative h-fit">
      <!-- Header Image -->
      <div class="relative h-fit min-h-[20rem] lg:max-h-[30rem] lg:min-h-[30rem]">
        <div
          class="absolute inset-0 min-h-[20rem] w-full bg-primary transition-all duration-700 ease-in-out lg:max-h-[30rem] lg:min-h-[30rem]"
          :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
        ></div>
        <NuxtImg
          v-if="artist.images"
          format="webp"
          preload
          :src="artist.images[artist.images.length - 1]"
          :alt="artist.name"
          @load="imageLoaded = true"
          class="min-h-[20rem] w-full object-cover lg:max-h-[30rem] lg:min-h-[30rem]"
        />
      </div>
      <!-- Header Data-->
      <div
        class="flex flex-col justify-end space-y-3 p-5 transition-all duration-300 ease-in-out md:absolute md:inset-0 md:min-h-full md:bg-secondary/50"
      >
        <div class="container mx-auto space-y-2.5">
          <!-- Data Fetched -->
          <div v-if="artist.name" class="space-y-2">
            <h1 class="text-2xl font-black lg:text-4xl 2xl:text-7xl">
              {{ artist.name }}
            </h1>
            <div class="flex flex-wrap gap-2 text-[0.5rem] lg:text-xs">
              <ComebackTag v-if="artist.type">
                {{ artist.type == 'SOLO' ? 'Soloist' : 'Group' }}
              </ComebackTag>
              <!-- <ComebackTag v-if="artist.type">K-Pop</CbTag>
              <ComebackTag v-if="artist.type">K-Hiphop</CbTag> -->
            </div>
            <!-- <div class="space-y-2 text-xs">
              <p>1, 054, 258, 031 streams on Youtube Music</p>
              <p>1, 054, 258, 031 streams on Youtube Music</p>
              <p>1, 054, 258, 031 streams on Youtube Music</p>
            </div> -->
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
            <!-- <button class="w-20 bg-quinary/30 py-1 text-center hover:bg-primary">
              <p>
                Like
                <span class="text-[0.5rem]">(1, 200)</span>
              </p>
            </button> -->
            <NuxtLink
              :to="`/artist/edit/` + artist.id"
              class="w-20 bg-quaternary py-1 text-center hover:bg-quinary"
            >
              <p>Edit</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!--  Artist Data -->
    <div class="container mx-auto space-y-10 pb-10 px-5 sm:px-0 md:px-5 md:py-10 2xl:px-0">
      <!-- Skeleton -->
      <div v-if="!artist.description && !artist.name" class="space-y-2">
        <Skeleton class="h-3 w-3/4 rounded-full" />
        <Skeleton class="h-3 w-full rounded-full" />
        <Skeleton class="h-3 w-full rounded-full" />
        <Skeleton class="h-3 w-3/4 rounded-full" />
        <Skeleton class="h-3 w-2/4 rounded-full" />
      </div>
      <!-- Description -->
      <section
        v-if="artist.description"
        class="text-sm leading-loose lg:max-w-3xl lg:px-0 xl:max-w-4xl xl:text-base"
      >
        <p>{{ artist.description }}</p>
      </section>
      <!-- Platforms -->
      <section v-if="artist.platforms" class="space-y-2">
        <p class="text-md font-black">Streaming Platforms</p>
        <div class="flex gap-2">
          <ComebackExternalLink
            v-for="social in artist.platforms"
            :key="social.name"
            :name="social.name"
            :link="social.link"
          />
        </div>
      </section>
      <!-- Socials -->
      <section v-if="artist.socials" class="space-y-2">
        <p class="text-md font-black">Socials Media Platforms</p>
        <div class="flex gap-2">
          <ComebackExternalLink
            v-for="social in artist.socials"
            :key="social.name"
            :name="social.name"
            :link="social.link"
          />
        </div>
      </section>
      <!-- Members List -->
      <section v-if="memberList?.length" class="space-y-2.5">
        <p class="text-md font-black">Members</p>
        <div
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth"
        >
          <CardObject
            v-for="member in memberList"
            :key="member.id"
            :mainTitle="member.name"
            :subTitle="member.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="member.images[0]"
            :object-link="`/artist/${member.id}`"
            isArtist
          />
        </div>
      </section>
      <!-- Subunit List -->
      <section v-if="subunitList?.length" class="space-y-2.5">
        <p class="text-md font-black">Members</p>
        <div
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth"
        >
          <CardObject
            v-for="unit in subunitList"
            :key="unit.id"
            :mainTitle="unit.name"
            :subTitle="unit.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="unit.images[0]"
            :object-link="`/artist/${unit.id}`"
            isArtist
          />
        </div>
      </section>
      <!-- Groups List -->
      <section v-if="artist.groups?.length" class="space-y-2.5">
        <p class="text-md font-black">Groups</p>
        <div
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth"
        >
          <CardObject
            v-for="art in artist.groups"
            :key="art.id"
            :mainTitle="art.name"
            :subTitle="art.type == 'SOLO' ? 'Soloist' : 'Group'"
            :image="art.images[0]"
            :object-link="`/artist/${art.id}`"
            isArtist
          />
        </div>
      </section>
      <!-- Releases List -->
      <section v-if="artist.releases?.length" class="space-y-2.5">
        <p class="text-md font-black">Releases</p>
        <div
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth"
        >
          <CardObject
            v-for="release in artist.releases"
            :key="release.id"
            :mainTitle="release.name"
            :subTitle="release.type == 'ALBUM' ? 'ALBUM' : 'SINGLE'"
            :image="release.images[release.images.length - 1]"
            :object-link="`/release/${release.id}`"
            isReleaseDisplay
          />
        </div>
      </section>
    </div>
  </div>
</template>
