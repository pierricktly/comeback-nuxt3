<script setup lang="ts">
import 'animate.css'
const isPlayingVideo = useIsPlayingVideo()
</script>

<template>
  <div
    class="min-h-screen bg-secondary text-tertiary"
  >
    <Navigation
      class="hidden md:block"
    />
    <div
      class="inset-x-0 z-50 pb-4 pt-5 md:hidden"
    >
      <img
        src="~/assets/image/logo.png"
        alt="Comeback"
        quality="80"
        loading="lazy"
        class="mx-auto block h-9 w-auto"
      />
    </div>
    <main
      class="min-h-[calc(100vh-60px)]"
    >
      <slot />
    </main>
    <LazyFooter />
    <!-- <LazyMobileNavigation
      class="md:hidden"
      :artistFetch="artistFetch"
      :isAdmin="isAdminStore"
      :isLogin="isLoginStore"
    /> -->
    <!-- <LazyYoutubePlayer
      ref="YTPlayer"
      v-if="isPlayingVideo"
      class="animate__animated animate__fadeInUp fixed bottom-0"
    /> -->
  </div>
</template>
