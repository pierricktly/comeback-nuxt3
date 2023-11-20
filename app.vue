<script setup>
// get token from runtime config
const { STRAPI_KEY } = useRuntimeConfig()

// init cookie for github token
const cookie = useCookie('STRAPI_KEY')

// set cookie value if not set
cookie.value = cookie.value || STRAPI_KEY
</script>

<template>
  <NuxtLayout>
    <div>
      <NuxtLoadingIndicator color="#9E0102" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<style>
/* Page Transitions - 0.4s Slide/Fade */
.page-enter-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-enter {
  opacity: 0;
}

.page-leave-active {
  opacity: 0;
}
</style>
