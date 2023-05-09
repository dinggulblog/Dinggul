<template>
  <div class="toggle">
    <Ico
      class="ico_toggle"
      :svg="isPublic ? 'toggle' : 'toggle-fill'"
      :size="'xl'"
      :color="isPublic ? 'var(--disable)' : 'primary'"
      @click="emits('update', !isPublic)"
    />

    <span :style="[isPublic ? { color: 'var(--text3)' } : { color: 'var(--primary)' }]">
      {{ isPublic ? '공개' : '비밀' }}
    </span>
  </div>
</template>

<script setup>
  const props = defineProps({
    isPublic: {
      type: Boolean,
    },
  })

  const emits = defineEmits(['update'])
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .toggle {
    @include flex;
    cursor: pointer;
    user-select: none;
    line-height: 1.5;

    .ico_toggle {
      transition: all 0.3s;
    }

    span {
      font-size: 1.2rem;
      margin: 0 0 0 0.4rem;
      letter-spacing: 0.1rem;
    }
  }
</style>
