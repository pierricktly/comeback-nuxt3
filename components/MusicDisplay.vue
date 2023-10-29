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

const convertDuration = (duration: any) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  if (seconds < 10) return `${minutes}:0${seconds}`
  return `${minutes}:${seconds}`
}
</script>

<template>
  <button
    class="group flex items-center justify-between rounded bg-quaternary p-2 px-3 hover:bg-tertiary/10"
  >
    <div class="flex items-center gap-3">
      <NuxtImg
        format="webp"
        :alt="musicName"
        :src="musicImage"
        class="hidden h-10 w-10 rounded shadow shadow-secondary md:block"
      />
      <div>
        <div class="flex items-center gap-2 text-start">
          <p class="truncate whitespace-nowrap text-sm font-semibold">
            {{ musicName }}
          </p>
          <p>-</p>
          <p>{{ convertDuration(duration) }}</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <NuxtImg
            format="webp"
            :alt="artistName"
            :src="artistImage"
            class="h-3 w-3 rounded-full shadow shadow-secondary"
          />
          <p>{{ artistName }}</p>
          <p>-</p>
          <p class="hidden md:block">{{ albumName }}</p>
          <!-- <p class="hidden sm:block">1, 054, 258, 031 on Youtube (Music)</p> -->
        </div>
      </div>
    </div>
    <div>
      <IconPlay
        class="h-10 w-10 transition-all duration-300 ease-in-out group-hover:text-primary/50"
      />
    </div>
  </button>
</template>
