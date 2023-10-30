<template>
  <div class="relative overflow-hidden rounded">
    <div
      class="absolute inset-0 min-h-[20rem] w-full bg-primary object-cover transition-all duration-500 ease-in-out lg:aspect-video lg:max-h-[36rem]"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    ></div>
    <NuxtImg
      format="webp"
      preload
      :alt="name"
      :src="image"
      @load="imageLoaded = true"
      class="min-h-[20rem] w-full object-cover lg:aspect-video lg:max-h-[36rem]"
    />
  </div>
  <NuxtLink
    :to="`/artist/${id}`"
    class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/30 p-5"
  >
    <p class="self-center text-3xl font-bold lg:text-5xl xl:text-7xl 2xl:text-9xl">
      {{ name }}
    </p>
  </NuxtLink>
</template>

<script lang="ts" setup>
const { image, name, id } = defineProps({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})
const imageLoaded = ref(false)
</script>
