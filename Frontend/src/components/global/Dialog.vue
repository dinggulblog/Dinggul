<template>
  <PopupModal ref="POPUP_EL">
    <div id="dialog">
      <div class="massage">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
      </div>

      <div class="btns">
        <Button :shape="'line-round'" @click="_cancel">{{ cancelButton }}</Button>
        <Button :shape="'fill-round'" :theme="'primary'" @click="_confirm"> {{ okButton }}</Button>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref } from 'vue'

const POPUP_EL = ref(null)
const title = ref(null)
const message = ref(null)
const okButton = ref('OK')
const cancelButton = ref('Cancel')

let resolvePromise = undefined
let rejectPromise = undefined

const show = (opts = {}) => {
  title.value = opts.title
  message.value = opts.message

  cancelButton.value = opts.cancelButton ? opts.cancelButton : cancelButton.value
  okButton.value = opts.okButton ? opts.okButton : okButton.value

  POPUP_EL.value.open()

  return new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
}

const _confirm = () => {
  POPUP_EL.value.close()
  resolvePromise(true)
}

const _cancel = () => {
  POPUP_EL.value.close()
  resolvePromise(false)
}

defineExpose({ show })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dialog {
  max-width: 40rem;
  box-shadow: var(--shadow1);
  background: var(--bg1);
  padding: 3.2rem 2.4rem;
  border-radius: 3.2rem;

  @include mobile {
    max-width: 30rem;
  }

  .massage {
    padding: 0 1.2rem;

    h2 {
      font-weight: 500;
      font-size: 2rem;
      text-align: center;
      color: var(--primary);

      @include mobile {
        font-size: 1.8rem;
      }
    }

    p {
      margin-top: 2.4rem;
      font-size: 1.4rem;
      color: var(--text3);
      white-space: pre;

      @include mobile {
        font-size: 1.6rem;
      }
    }
  }

  .btns {
    @include flex($jc: end);
    margin-top: 3.2rem;

    button:nth-child(1) {
      margin: 0 1.2rem 0 0;
    }
  }
}
</style>
