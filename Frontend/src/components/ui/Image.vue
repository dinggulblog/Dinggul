<template>
  <img :src="currentSrc" :alt="filename" @error.once="onError">
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import DEFAULT_SRC from '../../assets/default_thumbnail.webp'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  defaultSrc: {
    type: String,
    default: DEFAULT_SRC
  },
  filename: {
    type: String,
    default: 'image'
  },
  timeout: {
    type: Number,
    default: 2000
  }
})

const { src, defaultSrc } = toRefs(props)
const currentSrc = ref('')

const loadImage = (newSrc, timeout = props.timeout) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = newSrc

    const onLoad = () => {
      clearTimeout(timerId)
      resolve()
    }

    const onError = () => {
      clearTimeout(timerId)
      reject()
    }

    const timerId = setTimeout(() => {
      onError()
    }, timeout)

    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
  })
}

const loadImages = async () => {
  const srcs = [src.value, src.value.replace('thumbnail-', ''), defaultSrc.value]
  for (const src of srcs) {
    try {
      await loadImage(src)
      currentSrc.value = src
      break
    } catch (error) {
      // Ignore error and try next src
    }
  }
}

const onError = () => {
  loadImages()
}

onMounted(() => {
  loadImages()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
