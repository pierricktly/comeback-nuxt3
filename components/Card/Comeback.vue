<script setup lang="ts">
const { date, artistName, message, artistId } = defineProps({
  date: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    required: true,
  },
})

function getDaysUntil(dateString: string): number {
  const today = new Date()
  const futureDate = new Date(dateString)
  const timeDifference = futureDate.getTime() - today.getTime()
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
  return daysDifference
}

//if date in argument is today return true
function isToday(dateString: string): boolean {
  const today = new Date()
  const futureDate = new Date(dateString)
  return (
    today.getFullYear() === futureDate.getFullYear() &&
    today.getMonth() === futureDate.getMonth() &&
    today.getDate() === futureDate.getDate()
  )
}
</script>

<template>
  <div class="flex w-full justify-between overflow-hidden rounded bg-quinary text-xs">
    <div class="flex gap-1">
      <p
        class="w-10 p-1 px-1.5 text-center"
        :class="isToday(date) ? 'bg-primary' : 'bg-tertiary font-bold text-secondary'"
      >
        {{ isToday(date) ? 'Today' : `D-${getDaysUntil(date)}` }}
      </p>
      <NuxtLink :to="`/artist/${artistId}`" class="p-1 hover:text-primary">
        {{ artistName }}
      </NuxtLink>
    </div>
    <p class="p-1 pr-2">
      {{ message }}
    </p>
  </div>
</template>
