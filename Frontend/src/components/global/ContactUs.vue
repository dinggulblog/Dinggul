<template>
  <PopupModal ref="POPUP_EL">
    <div id="contact-us">
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_contact-us">
        <div class="contact-us">
          <Form as="div" class="contact-us_form" v-slot="{ handleSubmit }" :validation-schema="contactUsSchema">
            <h2>contact us</h2>

            <form @submit="handleSubmit($event, onSendMail)" id="contact">
              <TextInput name="email" type="email" :value="user?.email" placeholder="답변 받으실 이메일" success-message="올바른 이메일 주소입니다." />
              <TextInput name="subject" type="text" placeholder="제목" spellcheck="false" />
              <TextArea name="content" placeholder="메시지를 적어주세요." />
              <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'">보내기</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useStore } from 'vuex'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

const { state, dispatch } = useStore()

const POPUP_EL = ref(null)
const TOAST_EL = inject('TOAST_EL')

const form = ref(null)
const user = computed(() => state.auth.user)

const contactUsSchema = Yup.object().shape({
  email: Yup.string().required('이메일을 입력해 주세요.').default(user.value?.email).email(),
  subject: Yup.string().required('제목을 입력해주세요.'),
  content: Yup.string(),
})

const onSendMail = async (values) => {
  const { success, error } = await dispatch('mail/createMail', values)

  if (!success) return TOAST_EL.value.open('error', error)

  close()
}

const open = () => {
  if (user.value) return POPUP_EL.value.open()

  close()
  TOAST_EL.value.open('error', '로그인한 유저만 이용 가능합니다.')
}

const close = () => {
  POPUP_EL.value.close()
}

defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#contact-us {
  width: 48rem;
  box-shadow: var(--shadow1);
  background: var(--bg1);
  padding: 3.2rem;
  border-radius: 3.2rem;
  overflow-y: auto;

  @include mobile {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .wrap_btn-close {
    display: flex;
    justify-content: flex-end;
  }

  .wrap_contact-us {
    .contact-us {
      /* common */
      width: 100%;

      h2 {
        @include flex-center;
        font-size: 2.4rem;
        color: var(--primary);
        font-weight: 400;
        margin: 0 0 4.8rem;
        text-transform: capitalize;
      }

      button {
        font-weight: 500;
        font-size: 1.3rem;
      }

      form {
        @include flex(column);

        &:deep(.TextInput) {
          margin: 0 0 4.8rem;

          .help-message {
            top: 4.8rem;
          }
        }

        &:deep(input) {
          margin: 0;
        }

        &:deep(.TextArea > textarea) {
          width: 100%;
          min-height: 40rem;
          resize: none;
          border-bottom: 1px solid var(--border2);
          color: var(--text4);
        }
      }

      .btn_submit {
        @include flex-center;
        width: 100%;
        height: 4rem;
        color: var(--text1);
        background-color: var(--primary);
        border-radius: 3.2rem;
        margin: 4.8rem 0 0;

        @include hover;
        @include active;
      }

      /* end common */
    }
  }
}
</style>
