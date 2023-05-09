<template>
  <Transition name="fade_up">
    <div class="bottom-sheet" ref="BOTTOM_SHEET_EL">
      <div class="wrap_items">
        <ul>
          <slot></slot>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { closeBottomSheets } from '../../common/util.js'

  const BOTTOM_SHEET_EL = ref(false)

  const open = () => {
    closeAll()
    BOTTOM_SHEET_EL.value.classList.add('show')
  }

  const close = () => {
    BOTTOM_SHEET_EL.value.classList.remove('show')
  }

  const toggle = () => {
    BOTTOM_SHEET_EL.value.classList.contains('show') ? close() : open()
  }

  const closeAll = () => {
    const buttomSheets = document.body.getElementsByClassName('bottom-sheet')

    for (let i = 0; i < buttomSheets.length; i++) {
      buttomSheets[i].classList.remove('show')
    }
  }

  onMounted(() => {
    document.addEventListener('click', closeBottomSheets)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeBottomSheets)
  })

  defineExpose({ toggle })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bottom-sheet {
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    @include position(fixed, $t:0, $b: 0, $l:0, $r:0, $z:999);

    &.show {
      @include flex($ai: end);
    }
  }

  .wrap_items {
    margin: 0 auto;
    width: 100%;
    letter-spacing: 0.05rem;
    box-shadow: var(--shadow1);
    background: var(--bg1);
    border-radius: 3.2rem 3.2rem 0 0;
    padding: 2.4rem 3.2rem;

    &:deep(ul) {
      li {
        padding: 1.6rem 0;

        span {
          font-size: 1.6rem;
          color: var(--text3);
          cursor: pointer;
        }
      }
    }
  }
</style>
