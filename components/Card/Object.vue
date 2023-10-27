<template>
  <NuxtLink
    :to="objectLink"
    class="group min-w-[10rem] max-w-[10rem] space-y-1.5 rounded bg-quaternary p-3 hover:bg-quinary 2xl:min-w-[11rem] 2xl:max-w-[11rem]"
  >
    <div class="relative">
      <div
        :class="`absolute inset-0 aspect-square w-full bg-primary object-cover transition-all duration-500 ease-in-out ${
          isArtist ? 'rounded-full' : 'rounded'
        } ${imageLoaded ? 'opacity-0' : 'opacity-100'}`"
      ></div>
      <NuxtImg
        :src="image"
        class="aspect-square w-full object-cover"
        @load="imageLoaded = true"
        :class="isArtist ? 'rounded-full' : 'rounded'"
      />
    </div>
    <p
      class="font-semibol truncate group-hover:underline group-hover:underline-offset-8 lg:text-xl"
    >
      {{ mainTitle }}
    </p>
    <p v-if="isArtist" class="truncate text-sm lg:text-base">{{ subTitle }}</p>
    <NuxtLink
      v-else
      :to="`/artist/${artistId}`"
      class="truncate text-sm hover:underline lg:text-base"
    >
      {{ subTitle }}
    </NuxtLink>
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
