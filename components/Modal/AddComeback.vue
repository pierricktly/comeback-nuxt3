<template>
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
    <NewsCreation :artistList="artistFetch" @close-modal="showModal = false" />
  </Modal>
</template>

<script setup>
import * as Mdl from '@kouts/vue-modal'

const { Modal } = Mdl

const { showModal,artistFetch } = defineProps({
  showModal: Boolean,
  artistFetch: Array,
})
</script>