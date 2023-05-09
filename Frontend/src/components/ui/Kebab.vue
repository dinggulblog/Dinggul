<template>
  <component :is="isMobile ? BottomSheet : Dropbox" ref="DROPBOX_EL">
    <li v-for="(value, key) in dropboxItems" :key="key">
      <span @click="value">{{ key }}</span>
    </li>
  </component>
</template>

<script setup>
  import { inject, ref } from 'vue'
  import Dropbox from './Dropbox.vue'
  import BottomSheet from './BottomSheet.vue'

  const props = defineProps({
    dropboxItems: {
      type: Object,
      required: true,
    },
  })

  const isMobile = inject('isMobile')
  const DROPBOX_EL = ref(null)

  const onToggle = () => {
    DROPBOX_EL.value.toggle()
  }

  defineExpose({ onToggle })
</script>
