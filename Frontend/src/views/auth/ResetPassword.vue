<template>
  <div class="resetPassword">
    <Form as="div" class="resetPassword_form" v-slot="{ handleSubmit }" :validation-schema="resetPasswordSchema">
      <h2>reset password</h2>

      <form @submit="handleSubmit($event, onUpdatePassword)">
        <TextInput name="newPassword" type="password" label="비밀번호" placeholder="Password" />
        <TextInput name="passwordConfirmation" type="password" label="비밀번호 확인" placeholder="Type password again" success-message="비밀번호가 정상적으로 입력되었습니다." />

        <Button type="submit" class="btn_submit" :content="'변경하기'" :shape="'fill-round-full'" :theme="'primary'" />
      </form>
    </Form>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import TextInput from '../../components/ui/TextInput.vue'

const TOAST_EL = inject('TOAST_EL')
const { dispatch } = useStore()
const { currentRoute, push } = useRouter()

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.'),
})

const onUpdatePassword = async (values) => {
  values.code = currentRoute.value.query.code
  const { success, error } = await dispatch('auth/updatePassword', values)

  if (!success) {
    return TOAST_EL.value.open('error', error)
  } else {
    TOAST_EL.value.open('success', '비밀번호 수정됨')
    push({ name: 'home' })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.resetPassword {
  @include flex(column);

  .resetPassword_form {
    padding: 3.2rem;

    @include mobile {
      padding: 0;
    }

    h2 {
      @include flex-center;
      font-size: 2.4rem;
      color: var(--primary);
      font-weight: 400;
      text-transform: capitalize;
    }

    p {
      font-size: 1.4rem;
      color: var(--text3);
      margin: 3.2rem 0 0;

      strong {
        text-decoration: underline;
        color: var(--primary);
      }
    }

    form {
      @include flex(column);
      font-size: 1.3rem;
      width: 37rem;

      @include mobile {
        width: 100%;
      }
    }

    .btn_submit {
      @include hover-bg;
      @include active-bg;
    }
  }
}
</style>
