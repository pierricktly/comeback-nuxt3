<template>
  <div
    class="min-w-[10rem] max-w-[10rem] space-y-1.5 rounded bg-quaternary p-3 2xl:min-w-[11rem] 2xl:max-w-[11rem]"
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
    <p class="truncate font-semibold lg:text-xl">{{ mainTitle }}</p>
    <p class="truncate text-sm lg:text-base">{{ subTitle }}</p>
  </div>
</template>

<script setup>
const { isArtist, mainTitle, subTitle, image } = defineProps({
  isArtist: {
    type: Boolean,
    default: false,
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
})
const imageLoaded = ref(false)
</script>
