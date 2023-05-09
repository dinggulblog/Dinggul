<template>
  <PopupModal ref="POPUP_EL">
    <div id="account">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_account">
        <div class="account">
          <!-- Sign-up Form -->
          <Form v-if="form === 'create'" as="div" class="create_account" v-slot="{ handleSubmit }" :validation-schema="createAccountSchema">
            <h2>create account</h2>
            <form @submit="handleSubmit($event, onCreateAccount)">
              <TextInput name="email" type="email" label="이메일" placeholder="Email" success-message="올바른 이메일 주소입니다." />
              <TextInput name="password" type="password" label="비밀번호" placeholder="Password" />
              <TextInput name="passwordConfirmation" type="password" label="비밀번호 확인" placeholder="Type password again" success-message="비밀번호가 정상적으로 입력되었습니다." />
              <TextInput name="nickname" type="text" label="닉네임" placeholder="Nickname" success-message="사용할 수 있는 닉네임입니다." />
              <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'">가입 완료</Button>
            </form>
          </Form>

          <!-- Update Form -->
          <Form v-else-if="form === 'update' && user" as="div" class="update_account" v-slot="{ handleSubmit }" :validation-schema="updateAccountSchema">
            <h2>modify account</h2>
            <form @submit="handleSubmit($event, onUpdateAccount)">
              <TextInput name="email" type="email" label="이메일" :disabled="true" :value="user.email" success-message="이메일은 변경할 수 없습니다." />
              <TextInput name="currentPassword" type="password" label="현재 비밀번호" placeholder="Current Password" />
              <TextInput name="newPassword" type="password" label="새 비밀번호" placeholder="New Password" />
              <TextInput name="passwordConfirmation" type="password" label="새 비밀번호 확인" placeholder="Type password again" success-message="비밀번호가 정상적으로 입력되었습니다." />
              <TextInput name="nickname" label="닉네임" :value="user.nickname" placeholder="Nickname" success-message="사용할 수 있는 닉네임입니다." />
              <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'">수정 완료</Button>
            </form>

            <div class="wrap_btn_sign-out">
              <Button class="btn_sign-out" @click="onDeleteAccount">회원 탈퇴</Button>
            </div>
          </Form>

          <!-- Admin Update Form -->
          <Form v-else-if="form === 'admin-update' && member" as="div" class="update_account" v-slot="{ handleSubmit }" :validation-schema="updateMemberSchema">
            <h2>{{ member.nickname }}님의 정보</h2>
            <form @submit="handleSubmit($event, onUpdateMember)">
              <TextInput name="nickname" label="닉네임" :value="member.nickname" placeholder="Nickname" success-message="사용할 수 있는 닉네임입니다." />
              <div class="wrap_roles">
                <fieldset>
                  <legend>회원 권한</legend>
                  <div class="wrap_checkbox">
                    <Checkbox name="roles" label="user" value="user" :check="member.roles.some((role) => role.name === 'USER')" />
                    <Checkbox name="roles" label="admin" value="admin" :check="member.roles.some((role) => role.name === 'ADMIN')" />
                  </div>
                </fieldset>
              </div>

              <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'">수정 완료</Button>
            </form>
          </Form>

          <!-- Login Form -->
          <Form v-else as="div" class="login" v-slot="{ handleSubmit }" :validation-schema="loginSchema">
            <h2>member login</h2>
            <form @submit="handleSubmit($event, onLogin)" class="login_form">
              <TextInput name="email" type="email" label="이메일" placeholder="User ID (Email)" />
              <TextInput name="password" type="password" label="비밀번호" placeholder="Password" />
              <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'">로그인</Button>
            </form>

            <div class="wrap_find_account">
              <p>계정 정보를 잊으셨나요?</p>
              <router-link :to="{ name: 'findAccount' }" class="a_find-account" @click="close">계정 찾기</router-link>
            </div>

            <div class="wrap_sign-up">
              <Button class="btn_create-account" :theme="'primary'" @click="form = 'create'">회원 가입</Button>
            </div>
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

const { state, dispatch, commit } = useStore()

const POPUP_EL = ref(null)
const TOAST_EL = inject('TOAST_EL')

const form = ref('login')
const user = computed(() => state.auth.user)
const member = computed(() => state.auth.editMembers.at(0))

const loginSchema = Yup.object().shape({
  email: Yup.string().required('이메일을 입력해 주세요.').email(),
  password: Yup.string().required('패스워드를 입력해 주세요.'),
})

const createAccountSchema = Yup.object().shape({
  email: Yup.string().required('이메일을 입력해 주세요.').email(),
  password: Yup.string()
    .required()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
  passwordConfirmation: Yup.string()
    .min(4)
    .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
  nickname: Yup.string()
    .required('닉네임을 정해주세요.')
    .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
})

const updateAccountSchema = Yup.object().shape({
  email: Yup.string().default(user.value?.email).email(),
  currentPassword: Yup.string().required(),
  newPassword: Yup.string()
    .nullable(true)
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
  passwordConfirmation: Yup.string()
    .min(4)
    .oneOf([Yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.'),
  nickname: Yup.string()
    .default(user.value?.nickname)
    .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
})

const updateMemberSchema = Yup.object().shape({
  nickname: Yup.string()
    .default(member.value?.nickname)
    .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
  roles: Yup.array().of(Yup.string().required()),
})

const onLogin = async (values) => {
  const { success, error } = await dispatch('auth/login', values)
  !success ? TOAST_EL.value.open('error', error) : close()
}

const onCreateAccount = async (values) => {
  const { success, error } = await dispatch('auth/createAccount', values)
  !success ? TOAST_EL.value.open('error', error) : close()
}

const onUpdateAccount = async (values) => {
  const { success, error } = await dispatch('auth/updateAccount', values)
  !success ? TOAST_EL.value.open('error', error) : close()
}

const onUpdateMember = async (values) => {
  values._id = member.value._id
  const { success, error } = await dispatch('auth/updateMembers', [values])

  if (!success) {
    TOAST_EL.value.open('error', error)
  } else {
    close()
    TOAST_EL.value.open('success', `${values.nickname}님의 정보가 수정되었습니다.`)
  }
}

const onDeleteAccount = async (values) => {
  if (!confirm('계정 탈퇴를 진행하시겠습니까?\n삭제가 진행되면 15일 이내에 복구가 가능하며, 이후에는 데이터가 완전히 지워집니다.')) return

  const { success, error } = await dispatch('auth/deleteAccount', values)
  !success ? TOAST_EL.value.open('error', error) : close()
}

const open = (type) => {
  form.value = type
  POPUP_EL.value?.open()
}

const close = () => {
  POPUP_EL.value?.close()
}

defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#account {
  width: 37rem;
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
    @include flex-right;
  }

  .wrap_account {
    .account {
      /* common */
      width: 100%;

      h2 {
        @include flex-center;
        font-size: 2.4rem;
        color: var(--primary);
        font-weight: 400;
        margin: 0 0 calc(4.8rem - 3.2rem);
        text-transform: capitalize;
      }

      form {
        @include flex(column, $ai: start);
        font-size: 1.3rem;

        .wrap_roles {
          margin: 3.2rem 0 0;

          legend {
            color: var(--primary);
            margin: 0 0 1.6rem;
          }
          .wrap_checkbox {
            @include flex;
          }
        }
      }

      .btn_submit {
        margin: 4.8rem 0 0;

        @include hover-bg;
        @include active-bg;
      }

      /* end common */

      .update_account {
        .wrap_btn_sign-out {
          @include flex-center;
          margin: 4.8rem 0 0;
          .btn_sign-out {
            text-decoration: underline;
          }
        }
      }

      /* login */
      .login {
        .btn_submit {
          margin: 2.4rem 0 0;
        }
        .wrap_find_account {
          margin: 3.2rem 0;
          @include flex-col-center;

          p {
            font-size: 1.2rem;
            color: var(--text3);
            margin: 0 0 1.6rem;
          }

          .a_find-account {
            text-decoration: underline;
            font-size: 1.2rem;
            color: var(--primary);
          }
        }

        .wrap_sign-up {
          @include flex-center;
          width: 100%;
          border-top: 0.1rem solid var(--border3);
          padding: 3.2rem 0 0;
        }

        .btn_create-account {
          @include hover;
          @include active;
        }
      }
    }
  }
}
</style>
