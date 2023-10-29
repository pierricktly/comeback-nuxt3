<script setup lang="ts">
import {
  GRAPHQL_QUERY_GET_ARTIST_BY_ID_FOR_EDIT,
  GRAPHQL_QUERY_GET_ALL_ARTISTS,
  GRAPHQL_MUTATION_UPDATE_ARTIST,
} from '@/constants/graphql'
import VueMultiselect from 'vue-multiselect'
import _ from 'lodash'
import type { Artist } from "@/types/artist"


// Original Data
const artistGQ = ref<Artist>({} as Artist)
// Data to edit
const artistToEdit = ref<Artist>({} as Artist)
// List of artists
const artistList = ref(null)
// List of styles
const stylesList = ref(null)
const isUploadingEdit = ref(false)
const route = useRoute()

// Get artist data from graphql
const { data }: any = await useAsyncQuery(GRAPHQL_QUERY_GET_ARTIST_BY_ID_FOR_EDIT, {
  artistId: route.params.id,
}).catch((error) => {
  console.log(error)
})

const { data: dataAllArtists }: any = await useAsyncQuery(
  GRAPHQL_QUERY_GET_ALL_ARTISTS,
).catch((error) => {
  console.log(error)
})

const { mutate } = useMutation(GRAPHQL_MUTATION_UPDATE_ARTIST)

const formatArtistData = async () => {
  const artistTmp = ref<Artist>({} as Artist)
  if (data.value) {
    artistTmp.value.id = data.value.artist.data.id
    artistTmp.value.idYoutubeMusic =
      data.value.artist.data.attributes.idYoutubeMusic || ''
    artistTmp.value.name = data.value.artist.data.attributes.name
    artistTmp.value.description = data.value.artist.data.attributes.description || ''
    artistTmp.value.type = data.value.artist.data.attributes.type
    artistTmp.value.images = data.value.artist.data.attributes.images
    artistTmp.value.styles = data.value.artist.data.attributes.styles || []
    artistTmp.value.socials = data.value.artist.data.attributes.socials || []
    artistTmp.value.platforms = data.value.artist.data.attributes.platforms || []
    if (data.value.artist.data.attributes.members) {
      //for each member use formatMiniArtistObject to have a list in artistTmp.value.members
      artistTmp.value.members = await Promise.all(
        data.value.artist.data.attributes.members?.data.map(async (member: any) => {
          return await formatMiniArtistObject(member)
        }),
      )
    }
    if (data.value.artist.data.attributes.groups) {
      //for each group use formatMiniArtistObject to have a list in artistTmp.value.groups
      artistTmp.value.groups = await Promise.all(
        data.value.artist.data.attributes.groups?.data.map(async (group: any) => {
          return await formatMiniArtistObject(group)
        }),
      )
    }
  }
  return artistTmp.value
}

const formatMiniArtistObject = async (artist: any) => {
  let a = {} as Artist

  a.id = artist.id
  a.name = artist.attributes.name
  a.images = artist.attributes.images
  a.type = artist.attributes.type

  return a
}

const compareFields = (field1: any, field2: any) => {
  return _.isEqual(field1, field2)
}

const updateArtist = async () => {
  // isUploadingEdit.value = true
  const updatedFields: Partial<Artist> = {}

  Object.keys(artistToEdit.value).forEach((key) => {
    if (!compareFields(artistToEdit.value[key], artistGQ.value[key])) {
      updatedFields[key] = artistToEdit.value[key]
    }
  })

  // if artistToEdit doesn't have any field to update then return
  if (Object.keys(artistToEdit.value).length == 0) {
    console.log('artistToEdit', artistToEdit.value)
    return
  }

  if (updatedFields.groups) {
    let groupsTmp: string[] = []
    updatedFields.groups.map((group: Artist) => {
      groupsTmp.push(group.id)
    })
    console.log('groupsTmp', groupsTmp)
    updatedFields.groups = groupsTmp
  }

  if (updatedFields.members) {
    let membersTmp: string[] = []
    updatedFields.members.map((member: Artist) => {
      membersTmp.push(member.id)
    })
    console.log('membersTmp', membersTmp)
    updatedFields.members = membersTmp
  }

  const response = await mutate({
      data: updatedFields,
      updateArtistId: route.params.id,
  })
  .then((response) => {
    console.log(response)
    // isUploadingEdit.value = false
    // redirect to artist page
  const router = useRouter()
    router.push(`/artist/${route.params.id}`)
  })
  .catch((error) => {
    console.log(error)
  })
}

onMounted(async () => {
  // fetch data
  artistGQ.value = await formatArtistData()
  artistToEdit.value = _.cloneDeep(await formatArtistData())

  if (dataAllArtists.value) {
    artistList.value = await Promise.all(
      dataAllArtists.value.artists.data.map(async (member: any) => {
        return await formatMiniArtistObject(member)
      }),
    )
    // remove artistGQ from artistList
    if (artistList.value) {
      artistList.value = artistList.value?.filter((artist: Artist) => {
        return artist.id != artistGQ.value.id
      })
    }
  }
})
</script>

<template>
  <div class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10">
    <div
      class="flex items-center gap-2 border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl"
    >
      <p>Artist Edition :</p>
      <p v-if="artistGQ.name">{{ artistGQ.name }}</p>
      <Skeleton v-else class="h-5 w-40 rounded" />
    </div>

    <div class="space-y-5">
      <!-- Picture -->
      <div>
        <NuxtImg
          v-if="artistGQ.images"
          :src="artistGQ.images[artistGQ.images.length - 1]"
          :alt="artistGQ.name"
          class="h-80 w-full rounded object-cover"
        />
        <Skeleton v-else class="h-80 w-full rounded" />
      </div>
      <!-- Name & Id -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CbInput
          v-if="artistToEdit.name"
          label="Name"
          :placeholder="artistGQ.name"
          v-model="artistToEdit.name"
        />
        <Skeleton v-else class="h-10 w-full rounded" />
        <CbInput
          v-if="artistToEdit.id"
          label="Unique Id"
          :placeholder="artistGQ.id"
          v-model="artistToEdit.id"
          disabled
        />
        <Skeleton v-else class="h-10 w-full rounded" />
      </div>
      <!-- Id YTM & Type -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CbInput
          v-if="artistToEdit.idYoutubeMusic"
          label="Id Youtube Music"
          :placeholder="artistGQ.idYoutubeMusic"
          v-model="artistToEdit.idYoutubeMusic"
        />
        <Skeleton v-else class="h-10 w-full rounded" />
        <div v-if="artistToEdit.type" class="space-y-1">
          <CbLabel label="Type" />
          <select
            v-model="artistToEdit.type"
            class="w-full appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
          >
            <option value="SOLO" class="text-secondary">SOLO</option>
            <option value="GROUP" class="text-secondary">GROUP</option>
          </select>
        </div>
        <Skeleton v-else class="h-10 w-full rounded" />
      </div>
      <!-- Styles -->
      <div class="flex flex-col gap-1">
        <CbLabel label="Styles" />
        <!-- <VueMultiselect
          v-if="artistToEdit.styles"
          v-model="artistToEdit.styles"
          label="name"
          track-by="name"
          placeholder="Search or add a style"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        /> -->
      </div>
      <!-- Description -->
      <div class="flex flex-col gap-1">
        <CbLabel label="Description" />
        <textarea
          :placeholder="artistGQ.description || 'Description'"
          v-model="artistToEdit.description"
          class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
        />
      </div>
      <!-- Group -->
      <div v-if="artistList" class="flex flex-col gap-1">
        <CbLabel label="Group" />
        <VueMultiselect
          v-model="artistToEdit.groups"
          label="name"
          track-by="name"
          :options="artistList"
          placeholder="Search or add a group"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Members -->
      <div v-if="artistList" class="flex flex-col gap-1">
        <CbLabel label="Members" />
        <VueMultiselect
          v-model="artistToEdit.members"
          label="name"
          track-by="name"
          :options="artistList"
          placeholder="Search or add a member"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Platforms -->
      <div class="w-full space-y-2">
        <CbLabel label="Platforms" />
        <div
          v-for="(platform, index) in artistToEdit.platforms"
          :key="platform"
          class="flex w-full gap-1"
        >
          <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
            <input
              type="text"
              :value="platform.name"
              @input="artistToEdit.platforms[index].name = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              :value="platform.link"
              @input="artistToEdit.platforms[index].link = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
          </div>
          <button
            class="rounded bg-primary p-5 text-xs hover:bg-red-900"
            @click="
              artistToEdit.platforms.splice(artistToEdit.platforms.indexOf(platform), 1)
            "
          >
            Delete
          </button>
        </div>
        <button
          class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
          @click="artistToEdit.platforms.push({ name: '', link: '' })"
        >
          Add Platforms
        </button>
      </div>
      <!-- Socials -->
      <div class="w-full space-y-2">
        <CbLabel label="Socials" />
        <div
          v-for="(social, index) in artistToEdit.socials"
          :key="social"
          class="flex w-full gap-2"
        >
          <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
            <input
              type="text"
              :value="social.name"
              placeholder="Socials Name"
              @input="artistToEdit.socials[index].name = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              :value="social.link"
              placeholder="Socials Link"
              @input="artistToEdit.socials[index].link = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
          </div>
          <button
            class="rounded bg-primary p-5 text-xs hover:bg-red-900"
            @click="
              artistToEdit.socials.splice(artistToEdit.socials.indexOf(platform), 1)
            "
          >
            Delete
          </button>
        </div>
        <button
          class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
          @click="artistToEdit.socials.push({ name: '', link: '' })"
        >
          Add Socials
        </button>
      </div>
    </div>

    <div class="border-t border-zinc-700 pt-3">
      <button
        @click="updateArtist"
        :disabled="isUploadingEdit"
        class="w-full rounded bg-primary py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
      >
        {{ isUploadingEdit ? 'Loading' : 'Saves' }}
      </button>
    </div>
  </div>
</template>
