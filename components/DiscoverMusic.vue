<template>
  <div>
    <div v-if="music && music?.artists">
      <button
        @click="playVideo(music.videoId)"
        class="group relative aspect-square max-h-96 w-full overflow-hidden rounded-lg bg-quinary drop-shadow-lg"
      >
        <div v-if="music.images" class="relative">
          <div
            class="absolute inset-0 h-full w-full bg-quinary transition-all duration-500 ease-in-out"
            :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
          />
          <NuxtImg
            format="webp"
            loading="lazy"
            :alt="music.name"
            :src="music.images[music.images.length - 1]"
            @load="imageLoaded = true"
            class="h-full w-full rounded object-cover"
          />
        </div>
        <div class="absolute inset-0 flex flex-col items-center justify-around bg-quinary/70 lg:py-5">
          <p v-if="music.artists && music.artists.length > 0" class="font-semibold md:text-xl xl:text-2xl">
            {{ music.artists[0].name }}
          </p>
          <IconPause
            v-if="isPlayingVideo && idYoutubeVideo === music.videoId"
            class="h-5 w-5 rounded-full border border-tertiary group-hover:bg-tertiary group-hover:text-quaternary md:h-10 md:w-10 lg:h-14 lg:w-14"
          />
          <IconPlay
            v-else
            class="h-5 w-5 rounded-full border border-tertiary group-hover:bg-tertiary group-hover:text-quaternary md:h-10 md:w-10 lg:h-14 lg:w-14"
          />
          <div class="space-y-3 text-center">
            <p v-if="music.name" class="font-bold">
              {{ music.name }}
            </p>
            <p v-if="music.album && music.album.name" class="hidden md:block">
              {{ music.album.name }}
            </p>
          </div>
        </div>
      </button>
    </div>
    <Skeleton v-else class="aspect-square h-full max-h-96 w-full rounded-lg bg-quinary drop-shadow-lg" />
  </div>
</template>

<script lang="ts" setup>
const { getRandomMusic } = useGeneralFunction()
const music = ref({} as any)

onMounted(async () => {
  music.value = await getRandomMusic()
})

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const musicNamePlaying = useMusicNamePlaying()
const authorNamePlaying = useAuthorNamePlaying()

const imageLoaded = ref(false)

const playVideo = (videoId: any) => {
  if (isPlayingVideo.value && idYoutubeVideo.value == videoId) {
    isPlayingVideo.value = false
  } else {
    idYoutubeVideo.value = videoId
    isPlayingVideo.value = true
    musicNamePlaying.value = music.value.name
    authorNamePlaying.value = music.value.artists[0].name
  }
}
</script>
