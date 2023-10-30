<template>
  <NuxtLink
    :aria-label="`${name}'s link`"
    rel="noopener"
    :to="link"
    target="_blank"
    class="flex h-fit w-fit items-center gap-2 rounded bg-quaternary px-3.5 py-2.5 text-sm hover:bg-quinary"
  >
    <NuxtImg :src="icon" :alt="name" class="h-5 w-5" />
    <p class="hidden md:block">{{ name }}</p>
  </NuxtLink>
</template>

<script setup>
const { link, name } = defineProps({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
})

const icon = computed(() => {
  if (link.includes('youtube') && link.includes('music.')) {
    return '../public/youtube_music.png'
  } else if (link.includes('youtube')) {
    return '../public/youtube.png'
  } else if (link.includes('apple') && link.includes('music')) {
    return '../public/apple_music.png'
  } else if (link.includes('spotify')) {
    return '../public/spotify.png'
  } else if (link.includes('tidal')) {
    return '../public/tidal.png'
  } else if (link.includes('soundcloud')) {
    return '../public/sound_cloud.png'
  } else if (link.includes('facebook')) {
    return '../public/facebook.png'
  } else if (link.includes('instagram')) {
    return '../public/instagram.png'
  } else if (link.includes('twitter') || link.includes('x.com')) {
    return '../public/x.png'
  } else if (link.includes('tiktok')) {
    return '../public/tiktok.png'
  } else if (link.includes('snapchat')) {
    return '../public/snapchat.png'
  } else if (link.includes('weibo')) {
    return '../public/weibo.png'
  } else if (link.includes('deezer')) {
    return '../public/deezer.png'
  } else {
    return '../public/default.png'
  }
})

// onMounted(() => {
//   selectIcon()
// })

// const icon = ref('')

// function selectIcon() {
//   if (link.includes('youtube') && link.includes('music.')) {
//     icon.value = '../public/youtube_music.png'
//   } else if (link.includes('youtube')) {
//     icon.value = '../public/youtube.png'
//   } else if (link.includes('apple') && link.includes('music')) {
//     icon.value = '../public/apple_music.png'
//   } else if (link.includes('spotify')) {
//     icon.value = '../public/spotify.png'
//   } else if (link.includes('tidal')) {
//     icon.value = '../public/tidal.png'
//   } else if (link.includes('soundcloud')) {
//     icon.value = '../public/sound_cloud.png'
//   } else if (link.includes('facebook')) {
//     icon.value = '../public/facebook.png'
//   } else if (link.includes('instagram')) {
//     icon.value = '../public/instagram.png'
//   } else if (link.includes('twitter') || link.includes('x.com')) {
//     icon.value = '../public/x.png'
//   } else if (link.includes('tiktok')) {
//     icon.value = '../public/tiktok.png'
//   } else if (link.includes('snapchat')) {
//     icon.value = '../public/snapchat.png'
//   } else if (link.includes('weibo')) {
//     icon.value = '../public/weibo.png'
//   } else {
//     icon.value = '../public/default.png'
//   }
// }
</script>
