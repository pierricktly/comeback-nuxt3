<script setup lang="ts">
import {
  GRAPHQL_QUERY_GET_ARTIST_BY_ID_FOR_EDIT,
  GRAPHQL_QUERY_GET_ALL_ARTISTS,
  GRAPHQL_MUTATION_UPDATE_ARTIST,
} from '@/constants/graphql'
import VueMultiselect from 'vue-multiselect'
import _ from 'lodash'
import type { Artist } from '@/types/artist'
const { $apollo: apollo } = useNuxtApp()

const { formatArtistData } = useGeneralFunction()

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

const compareFields = (field1: any, field2: any) => {
  return _.isEqual(field1, field2)
}

const updateArtist = async () => {
  // isUploadingEdit.value = true
  const updatedFields: Partial<Artist> = {}

  Object.keys(artistToEdit.value).forEach((key) => {
    // @ts-ignore
    if (!compareFields(artistToEdit.value[key], artistGQ.value[key])) {
      // @ts-ignore
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

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: GRAPHQL_MUTATION_UPDATE_ARTIST,
      variables: {
        data: updatedFields,
        updateArtistId: route.params.id,
      },
    })
    const artistData = response.data.artist.data
    console.log('artistData', artistData)
    artistGQ.value = await formatArtistData(artistData)
    artistToEdit.value = _.cloneDeep(await formatArtistData(artistData))
  } catch (e: any) {
    if (e.networkError) {
      console.error('Network error:', e.networkError)
    } else if (e.graphQLErrors) {
      e.graphQLErrors.forEach((err: any) => console.error('GraphQL error:', err))
    } else {
      console.error('Error fetching posts:', e)
    }
  }
}

onMounted(async () => {
  if (!apollo) throw new Error('Apollo client is not initialized')

  try {
    // @ts-ignore
    const response = await apollo.query({
      query: GRAPHQL_QUERY_GET_ARTIST_BY_ID_FOR_EDIT,
      variables: {
        artistId: route.params.id,
      },
    })
    const artistData = response.data.artist.data
    console.log('artistData', artistData)
    artistGQ.value = await formatArtistData(artistData)
    artistToEdit.value = _.cloneDeep(await formatArtistData(artistData))
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
</script>

<template>
  <div class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10">
    <div class="flex items-center gap-2 border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl">
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
        <ComebackInput v-if="artistToEdit.name" label="Name" :placeholder="artistGQ.name" v-model="artistToEdit.name" />
        <Skeleton v-else class="h-10 w-full rounded" />
        <ComebackInput
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
        <ComebackInput
          v-if="artistToEdit.idYoutubeMusic"
          label="Id Youtube Music"
          :placeholder="artistGQ.idYoutubeMusic"
          v-model="artistToEdit.idYoutubeMusic"
        />
        <Skeleton v-else class="h-10 w-full rounded" />
        <div v-if="artistToEdit.type" class="space-y-1">
          <ComebackLabel label="Type" />
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
        <ComebackLabel label="Styles" />
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
        <ComebackLabel label="Description" />
        <textarea
          :placeholder="artistGQ.description || 'Description'"
          v-model="artistToEdit.description"
          class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
        />
      </div>
      <!-- Group -->
      <div v-if="artistList" class="flex flex-col gap-1">
        <ComebackLabel label="Group" />
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
        <ComebackLabel label="Members" />
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
        <ComebackLabel label="Platforms" />
        <div v-for="(platform, index) in artistToEdit.platforms" :key="platform" class="flex w-full gap-1">
          <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
            <input
              type="text"
              :value="platform.name"
              placeholder="Platform's Name"
              @input="artistToEdit.platforms[index].name = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              :value="platform.link"
              placeholder="Platform's Link"
              @input="artistToEdit.platforms[index].link = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
          </div>
          <button
            class="rounded bg-primary p-5 text-xs hover:bg-red-900"
            @click="artistToEdit.platforms.splice(artistToEdit.platforms.indexOf(platform), 1)"
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
        <ComebackLabel label="Socials" />
        <div v-for="(social, index) in artistToEdit.socials" :key="social" class="flex w-full gap-2">
          <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
            <input
              type="text"
              :value="social.name"
              placeholder="Social's Name"
              @input="artistToEdit.socials[index].name = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              :value="social.link"
              placeholder="Social's Link"
              @input="artistToEdit.socials[index].link = $event.target.value"
              class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
            />
          </div>
          <button
            class="rounded bg-primary p-5 text-xs hover:bg-red-900"
            @click="artistToEdit.socials.splice(artistToEdit.socials.indexOf(platform), 1)"
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
