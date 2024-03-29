<script setup lang="ts">
const {
  musicName,
  musicId,
  duration,
  artistName,
  artistId,
  artistImage,
  albumName,
  albumId,
  musicImage,
} = defineProps({
  musicName: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    required: true,
  },
  albumId: {
    type: String,
  },
  albumName: {
    type: String,
  },
  duration: {
    type: String,
  },
  artistImage: {
    type: String,
  },
  musicImage: {
    type: String,
    required: true,
  },
  musicId: {
    type: String,
    required: true,
  },
})
const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const musicNamePlaying = useMusicNamePlaying()
const authorNamePlaying = useAuthorNamePlaying()

const playVideo = (videoId: any) => {
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
  musicNamePlaying.value = musicName
  authorNamePlaying.value = artistName || ''
}

const convertDuration = (duration: any) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  if (seconds < 10) return `${minutes}:0${seconds}`
  return `${minutes}:${seconds}`
}
</script>

<template>
  <button
    v-if="musicId"
    @click="playVideo(musicId)"
    :disabled="idYoutubeVideo == musicId"
    class="flex items-center justify-between rounded bg-quaternary p-2 px-3"
    :class="idYoutubeVideo == musicId ? '' : 'group hover:bg-tertiary/10'"
  >
    <div class="flex w-11/12 items-center gap-3">
      <NuxtImg
        v-if="musicImage != null || musicImage != undefined"
        format="webp"
        :alt="musicName"
        :src="musicImage"
        class="hidden h-10 w-10 rounded shadow shadow-secondary md:block"
      />
      <div class="w-4/5">
        <div v-if="musicName" class="flex items-center gap-2 text-start">
          <p class="truncate whitespace-nowrap text-sm font-semibold">
            {{ musicName }}
          </p>
          <p class="hidden truncate md:block">-</p>
          <p class="hidden truncate md:block">{{ convertDuration(duration) }}</p>
        </div>
        <div v-if="artistName || albumId" class="flex items-center gap-2 text-xs">
          <NuxtImg
            v-if="artistImage"
            format="webp"
            :alt="artistName"
            :src="artistImage"
            class="h-3 w-3 rounded-full object-cover shadow shadow-secondary"
          />
          <NuxtLink
            v-if="artistName"
            :to="`/artist/${artistId}`"
            class="whitespace-nowrap hover:underline"
          >
            {{ artistName }}
          </NuxtLink>
          <p v-if="albumId" class="truncate text-xs md:block">-</p>
          <NuxtLink
            v-if="albumId"
            :to="`/release/${albumId}`"
            class="truncate text-xs hover:underline md:block"
          >
            {{ albumName }}
          </NuxtLink>
          <!-- <p class="hidden sm:block">1, 054, 258, 031 on Youtube (Music)</p> -->
        </div>
      </div>
    </div>
    <div>
      <IconPlay
        v-if="idYoutubeVideo != musicId"
        class="h-10 w-10 transition-all duration-300 ease-in-out"
      />
      <IconPause v-else class="h-10 w-10 transition-all duration-300 ease-in-out" />
    </div>
  </button>
</template>
