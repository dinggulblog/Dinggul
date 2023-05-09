<template>
  <Transition name="fade_down">
    <div class="toast-message" v-if="isVisible">
      <Ico class="ico_system" :svg="state.type" :color="state.color" />
      {{ state.message }}
    </div>
  </Transition>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const isVisible = ref(false)
  
  const state = computed(() => ({
    type: null,
    message: null,
    bgColor: null,
    color: null,
  }))

  const open = (type, message) => {
    if (isVisible.value) close()

    state.value.type = type
    state.value.message = message
    state.value.bgColor =
      type === 'success' ? `var(--success-light)` : type === 'warn' ? `var(--warning-light)` : `var(--error-light)`
    state.value.color = type === 'success' ? `var(--success)` : type === 'warn' ? `var(--warning)` : `var(--error)`
    isVisible.value = true
    setTimeout(close, 1000 * 3)
  }

  const close = () => {
    isVisible.value = false
  }

  defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .toast-message {
    @include flex;
    @include position(fixed, $t: 2.4rem, $r: 2.4rem, $z: 999);
    width: 32rem;
    height: 6.4rem;
    border-radius: 0.8rem;
    background: v-bind('state.bgColor');
    color: v-bind('state.color');
    border-color: v-bind('state.color');
    box-shadow: var(--shadow1);
    border: 1px solid;
    font-size: 1.4rem;
    padding: 2.4rem;

    .ico_system {
      margin: 0 0.8rem 0 0;
    }
  }
</style>
