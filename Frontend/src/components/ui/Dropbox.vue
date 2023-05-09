<template>
  <div class="dropbox">
    <div class="wrap_dropbox_items" ref="DROPBOX_ITEMS_EL">
      <ul>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { closeDropdowns } from '../../common/util.js'

  const DROPBOX_ITEMS_EL = ref(null)

  const open = () => {
    closeAll()
    DROPBOX_ITEMS_EL.value.classList.add('show')
  }

  const close = () => {
    DROPBOX_ITEMS_EL.value.classList.remove('show')
  }

  const toggle = () => {
    DROPBOX_ITEMS_EL.value.classList.contains('show') ? close() : open()
  }

  const closeAll = () => {
    const dropdowns = document.body.getElementsByClassName('wrap_dropbox_items')

    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show')
    }
  }

  onMounted(() => {
    document.addEventListener('click', closeDropdowns)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeDropdowns)
  })

  defineExpose({ toggle })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .dropbox {
    @include position;

    .wrap_dropbox_items {
      display: none;
      @include position(absolute, $t: 1.2rem, $r: 0, $z: 30);

      ul {
        width: 9.6rem;
        border-radius: 1.2rem;
        padding: 0.1rem 1.2rem;
        border:1px solid var(--border2);
        background: var(--bg1);

        &:deep(li) {
          margin: 2rem 0;
          font-size: 1.2rem;
          color: var(--text3);
          @include flex-center;

          span {
            cursor: pointer;
          }
        }
      }

      &.show {
        display: block;
      }
    }
  }
</style>
