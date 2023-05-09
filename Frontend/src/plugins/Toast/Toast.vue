<template>
  <Transition name="fade_down" ref="root" appear>
    <div
      class="toast-message"
      @click="close"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
    >
      <Ico class="ico_system" :svg="type" :color="style.color" />
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
  import { ref, computed, onBeforeMount, onMounted } from 'vue'
  import Ico from '../../components/ui/Ico.vue'
  import Timer from './timer.js'
  import Events from './events.js'
  import elements from './elements.js'
  
  const props = defineProps({
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    },
    delay: {
      type: Number,
      default: 3000
    },
    max: {
      type: [Number, Boolean],
      default: 1
    }
  })

  let timer = null
  let app = document.getElementById('app')

  const root = ref(null)
  const style = computed(() => ({
    color: `var(--${props.type})`,
    bgColor: `var(--${props.type}-light)`
  }))

  const close = () => {
    timer && timer.stop()
    setTimeout(() => { elements.removeElement(root.value) }, 100)
    Events.$off('toast-clear', close)
  }

  const open = () => {
    app && app.insertAdjacentElement('beforeend', root.value)
    timer = new Timer(close, props.delay)
  }

  const toggleTimer = (state) => {
    if (timer) {
      state ? timer.pause() : timer.resume()
    }
  }

  onBeforeMount(() => {
    if (!app) app = document.getElementById('app')
  })

  onMounted(() => {
    open()
    Events.$on('toast-clear', close)
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .toast-message {
    display: flex;
    position: fixed;
    align-items: center;
    top: 2.4rem;
    right: 2.4rem;
    z-index: 999;
    width: 32rem;
    height: 6.4rem;
    border-radius: 0.8rem;
    background: v-bind('style.bgColor');
    color: v-bind('style.color');
    border-color: v-bind('style.color');
    box-shadow: var(--shadow1);
    border: 1px solid;
    font-size: 1.4rem;
    padding: 2.4rem;

    .ico_system {
      margin: 0 0.8rem 0 0;
    }
  }
</style>
