<template>
  <button ref="BTN_EL" class="btn" type="button" :disabled="$store.state.loading.isLoading" @click="onClick">
    <Ico :svg="svg" :size="size"></Ico>
    <slot></slot>
  </button>
</template>

<script setup>
  import { computed } from 'vue'
  import { throttle } from '../../common/util.js'

  const props = defineProps({
    shape: {
      type: String,
      validator: (value) =>
        [
          'fill',
          'fill-full',
          'fill-round',
          'fill-round-full',
          'line',
          'line-full',
          'line-round',
          'line-round-full',
        ].includes(value),
    },
    size: {
      type: String,
      validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
      default: 'md',
    },
    theme: {
      type: String,
    },
    svg: {
      type: String,
    },
  })

  const emits = defineEmits(['click'])

  const state = computed(() => ({
    width: props.shape?.includes('full') ? '100%' : 'auto',
    padding: props.shape ? `var(--padding-${props.size})` : undefined,
    fontSize: props.size ? `var(--text-${props.size})` : '1.2rem',
    bgColor:
      props.shape?.includes('fill')
        ? props.theme
        ? `var(--${props.theme})`
        : `var(--bg2)`
        : undefined,
    color:
      props.shape?.includes('fill')
        ? '#fff'
        : props.theme
        ? `var(--${props.theme})`
        : `var(--text2)`,
    border: props.shape?.includes('line') ? 'solid 0.1rem' : undefined,
    borderRadius: props.shape?.includes('round') ? '3.2rem' : undefined,
    borderColor:
     props.shape?.includes('line')
        ? props.theme
        ? `var(--${props.theme})`
        : `var(--border3)`
        : undefined,
    svgMargin: props.svg && props.content ? '0.8rem' : undefined,
  }))

  const onClick = throttle(() => emits('click'), 1000)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .btn {
    @include flex-center;
    width: v-bind('state.width');
    padding: v-bind('state.padding');
    color: v-bind('state.color');
    background-color: v-bind('state.bgColor');
    border: v-bind('state.border');
    border-color: v-bind('state.borderColor');
    border-radius: v-bind('state.borderRadius');
    font-size: v-bind('state.fontSize');
    font-weight: 500;

    svg {
      margin-right: v-bind('state.svgMargin');
    }
  }
</style>
