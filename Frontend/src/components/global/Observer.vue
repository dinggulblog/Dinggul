<template>
  <div class="observer" ref="TRIGGER_EL"></div>
</template>

<script setup>
  import { ref , onMounted, onUnmounted } from 'vue'

  const props = defineProps({
    page: {
      type: Number,
      default: 1
    },
  })

  const emits = defineEmits(['update'])

  const TRIGGER_EL = ref(null)

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      emits('update', props.page + 1)
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 1.0 })

  onMounted(() => {
    observer.observe(TRIGGER_EL.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .observer {
    width: 100%;
    height: 0;
  }
</style>
