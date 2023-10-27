<template>
  <div>
    <section v-if="newsToday.length">
      <div class="relative">
        <div class="absolute z-10 pt-10">
          <p
            class="w-fit bg-red-700 py-1 pl-8 pr-5 text-xs font-semibold uppercase drop-shadow-lg lg:text-xl xl:text-2xl"
          >
            Comeback Today
          </p>
        </div>

        <Swiper
          :modules="[SwiperAutoplay, SwiperParallax]"
          :slides-per-view="1"
          :loop="true"
          :parallax="true"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
        >
          <SwiperSlide
            v-for="news in newsToday"
            :key="news.id"
            class="swiper-slide relative"
          >
            <HomeSlider
              :image="news.artist.images[news.artist.images.length - 1]"
              :name="news.artist.name"
              :id="news.artist.id"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
    <section
      v-else
      class="relative flex min-h-[20rem] w-full flex-col justify-center rounded bg-[url('/public/slider-placeholder.webp')] bg-cover bg-center bg-no-repeat object-cover text-center lg:aspect-video lg:max-h-[40rem]"
    >
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="z-10 space-y-1.5 xl:space-y-5">
        <p class="text-4xl font-bold lg:text-6xl">
          Don't miss any
          <span class="text-primary">Comeback</span>
        </p>
        <p class="font-semibold lg:text-2xl 2xl:text-3xl">
          Track every next release by your favorite artists
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { newsToday } = defineProps({
  newsToday: {
    type: Array,
    required: true,
  },
})
</script>
