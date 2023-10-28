<template>
  <NuxtLink
    :to="objectLink"
    class="group min-w-[10rem] max-w-[10rem] space-y-3 rounded bg-quaternary p-4 shadow-xl shadow-secondary transition-all duration-500 ease-in-out hover:bg-quinary 2xl:min-w-[11rem] 2xl:max-w-[11rem]"
  >
    <div class="relative">
      <div
        :class="`absolute inset-0 aspect-square w-full bg-primary object-cover transition-all duration-500 ease-in-out ${
          isArtist ? 'rounded-full' : 'rounded'
        } ${imageLoaded ? 'opacity-0' : 'opacity-100'}`"
      ></div>
      <NuxtImg
        :src="image"
        class="aspect-square w-full object-cover shadow-xl shadow-secondary"
        @load="imageLoaded = true"
        :class="isArtist ? 'rounded-full' : 'rounded'"
      />
    </div>
    <div class="space-y-1.5">
      <p class="font-semibol truncate group-hover:underline">
        {{ mainTitle }}
      </p>
      <p v-if="isArtist" class="truncate text-sm">{{ subTitle }}</p>
      <NuxtLink
        v-else
        :to="`/artist/${artistId}`"
        class="truncate text-sm hover:underline lg:text-base"
      >
        {{ subTitle }}
      </NuxtLink>
    </div>
  </NuxtLink>
</template>

<script setup>
const { isArtist, artistId, mainTitle, subTitle, image, objectLink } = defineProps({
  isArtist: {
    type: Boolean,
    default: false,
  },
  artistId: {
    type: String,
  },
  mainTitle: {
    type: String,
    default: 'Main Title',
  },
  subTitle: {
    type: String,
    default: 'Subtitle',
  },
  image: {
    type: String,
    default: 'https://picsum.photos/200/200',
  },
  objectLink: {
    type: String,
    default: '/',
  },
})
const imageLoaded = ref(false)
</script>
