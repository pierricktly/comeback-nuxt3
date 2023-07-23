<script setup>
// import { Modal } from '@kouts/vue-modal'
const routeN = useRoute()
const navbar = ref(null)
const showModal = ref(false)

function handleScroll() {
  if (window.scrollY > 50) {
    navbar.value.classList.add('bg-secondary', 'border', 'border-zinc-700', 'shadow', 'shadow-zinc-700')
  } else {
    navbar.value.classList.remove('bg-secondary', 'border', 'border-zinc-700', 'shadow', 'shadow-zinc-700')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="sticky top-0 py-2 px-3 xl:py-3 z-50 transition-all duration-500 ease-in-out">
    <div ref="navbar"
      class="animate__animated animate__fadeInDown px-5 rounded-full transition-all duration-500 ease-in-out">
      <div class="mx-auto flex justify-between py-3 2xl:container">
        <NuxtLink to="/">
          <nuxt-img src="~/assets/image/logo.png" alt="Comeback" class="block h-8 w-auto" />
        </NuxtLink>
        <nav class="flex items-center justify-center text-sm space-x-5">
          <NuxtLink :to="`/`" :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'">
            Home
          </NuxtLink>
          <NuxtLink :to="`/calendar`" :class="routeN.name === 'calendar' ? 'text-white' : 'text-zinc-500'">
            Calendrier
          </NuxtLink>
          <NuxtLink :to="`/artist`" :class="routeN.name === 'artist' ? 'text-white' : 'text-zinc-500'">
            Artists
          </NuxtLink>
          <!-- <NuxtLink :to="`/`" :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'">
          Profil
        </NuxtLink> -->
          <NuxtLink :to="`/dashboard`" :class="routeN.name === 'dashboard' ? 'text-white' : 'text-zinc-500'">
            Dashboard
          </NuxtLink>
          <button @click="showModal = true"
            class="text-primary font-bold hover:text-red-500 hover:scale-110 transition-all ease-in-out duration-300">
            New Comeback
          </button>
        </nav>
      </div>
      <!-- <Modal v-model="showModal" title="Add a News" wrapper-class="animate__animated modal-wrapper"
        :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
        :in-class="`animate__fadeInDown`" :out-class="`animate__bounceOut`" bg-class="animate__animated"
        :bg-in-class="`animate__fadeInUp`" :bg-out-class="`animate__fadeOutDown`">
        <p>Modal content goes here...</p>
      </Modal> -->
    </div>
  </div>
</template>