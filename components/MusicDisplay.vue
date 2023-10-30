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
    default: 'Music Name',
  },
  artistName: {
    type: String,
    default: 'Artist Name',
  },
  artistId: {
    type: String,
    default: '1',
  },
  albumId: {
    type: String,
    default: '1',
  },
  albumName: {
    type: String,
    default: 'Album Name',
  },
  duration: {
    default: '120',
  },
  artistImage: {
    type: String,
    default: 'https://picsum.photos/200',
  },
  musicImage: {
    type: String,
    default: 'https://picsum.photos/200',
  },
  musicId: {
    type: String,
    default: '1',
  },
})
const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()

const playVideo = (videoId: any) => {
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
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
    @click="playVideo(musicId)"
    :disabled="idYoutubeVideo == musicId"
    class="flex items-center justify-between rounded bg-quaternary p-2 px-3"
    :class="idYoutubeVideo == musicId ? '' : 'group hover:bg-tertiary/10'"
  >
    <div class="flex w-11/12 items-center gap-3">
      <NuxtImg
        format="webp"
        :alt="musicName"
        :src="musicImage"
        class="hidden h-10 w-10 rounded shadow shadow-secondary md:block"
      />
      <div class="w-4/5">
        <div class="flex items-center gap-2 text-start">
          <p class="truncate whitespace-nowrap text-sm font-semibold">
            {{ musicName }}
          </p>
          <p class="hidden truncate md:block">-</p>
          <p class="hidden truncate md:block">{{ convertDuration(duration) }}</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <NuxtImg
            format="webp"
            :alt="artistName"
            :src="artistImage"
            class="h-3 w-3 rounded-full shadow shadow-secondary"
          />
          <NuxtLink :to="`/artist/${artistId}`" class="whitespace-nowrap hover:underline">
            {{ artistName }}
          </NuxtLink>
          <p class="truncate text-xs md:block">-</p>
          <NuxtLink
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
