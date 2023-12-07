<script setup>
import * as Mdl from '@kouts/vue-modal'

const { Modal } = Mdl
const showModal = ref(false)
const routeN = useRoute()

const navbar = ref(null)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (window.scrollY > 30) {
    navbar.value.classList.add(
      'bg-secondary',
      'border',
      'border-zinc-700',
      'shadow',
      'shadow-zinc-700',
    )
  } else {
    navbar.value.classList.remove(
      'bg-secondary',
      'border',
      'border-zinc-700',
      'shadow',
      'shadow-zinc-700',
    )
  }
}
</script>

<template>
  <div class="sticky top-0 z-50 px-3 py-2 transition-all duration-300 ease-in-out">
    <div
      ref="navbar"
      class="animate__animated animate__fadeInDown rounded-full px-5 transition-all duration-500 ease-in-out"
    >
      <div class="mx-auto flex justify-between py-3 2xl:container 2xl:px-10">
        <NuxtLink to="/">
          <img src="~/assets/image/logo.png" alt="Comeback" class="block h-8 w-auto" />
        </NuxtLink>
        <nav class="flex items-center justify-center space-x-5 text-sm">
          <NuxtLink
            :to="`/`"
            :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'"
          >
            Home
          </NuxtLink>
          <NuxtLink
            :to="`/calendar`"
            :class="routeN.name === 'calendar' ? 'text-white' : 'text-zinc-500'"
          >
            Calendar
          </NuxtLink>
          <!-- <NuxtLink
            :to="`/artist`"
            :class="routeN.name === 'artist' ? 'text-white' : 'text-zinc-500'"
          >
            Artists
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/artist`"
            :class="routeN.name === 'dashboard-index-*' ? 'text-white' : 'text-zinc-500'"
          >
            Dashboard
          </NuxtLink> -->
          <button
            @click="showModal = true"
            class="font-bold text-primary transition-all duration-300 ease-in-out hover:scale-110 hover:text-red-500"
          >
            New Comeback
          </button>
          <NuxtLink
            :to="`/authentification`"
            :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'"
          >
            Log In
          </NuxtLink>
          <button
            @click="signOut"
            :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'"
          >
            Log Out
          </button>
        </nav>
      </div>
    </div>
    <Modal
      v-model="showModal"
      title="Add a News"
      wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <NewsCreation :artistList="artistFetch" @close-modal="showModal = false"/>
    </Modal>
  </div>
</template>
