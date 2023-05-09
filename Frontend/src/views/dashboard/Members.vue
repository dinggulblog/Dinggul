<template>
  <div class="member-list">
    <div class="wrap_table">
      <div class="table-header">
          <div class="table-head" v-for="head in tableHeads" :key="head">
            {{ head }}
          </div>
      </div>

      <div class="table-body">
          <div class="table-row" v-for="(member, idx) in members" :key="idx">
            <div class="table-cell">
              <input type="checkbox" ref="CHECKBOX_EL" :data-index="idx" class="checkbox" aria-label="checkbox"/>
            </div>

            <div class="table-cell">
              <Image class="avatar img_avatar" :src="member.avatar?.thumbnail ?? DEFAULT_AVATAR_64"  />
            </div>

            <div class="table-cell">
              <span class="email">{{ member.email }}</span>
            </div>

            <div class="table-cell">
              <span class="nickname">{{ member.nickname }}</span>
            </div>

            <div class="table-cell">
              <span v-for="role in member.roles" :key="role" class="role" :class="role.name">{{ role.name }}</span>
            </div>

            <div class="table-cell">
              <span class="createdAt">{{ getTime(member.createdAt) }}</span>
            </div>

            <div class="table-cell">
              <span class="lastLoggedAt">{{ getTime(member.updatedAt) }}</span>
            </div>

            <div class="table-cell">
              <span class="isActive">{{ member.isActive ? '활성' : '비활성' }}</span>
            </div>

            <div class="table-cell">
              <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.KEBAB_SLOT_EL[idx].onToggle()" aria-label="option"/>

              <Kebab ref="KEBAB_SLOT_EL" :dropboxItems="{ '회원 정보 수정': () => onUpdateMember(member) }" />
            </div>
          </div>
      </div>
    </div>

    <div class="wrap_btns">
      <Button :shape="'line-round'" :size="'sm'" @click="() => onUpdateActive(true)" class="btn_active-member">회원 활성</Button>
      <Button :shape="'line-round'" :size="'sm'" @click="() => onUpdateActive(false)" class="btn_block-member">회원 정지</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { getTime } from '../../common/time.js'
import DEFAULT_AVATAR_64 from '../../assets/default_avatar_64.webp'

const { dispatch, commit, state } = useStore()

const TOAST_EL = inject('TOAST_EL')
const ACCOUNT_EL = inject('ACCOUNT_EL')
const CHECKBOX_EL = ref(null)

const members = computed(() => state.auth.members)
const editMembers = computed(() => state.auth.editMembers)

const tableHeads = ref(['선택', '아바타', '이메일', '닉네임', '권한', '가입일', '마지막 로그인', '상태', '옵션'])

const getMembers = async () => {
  const { success, error } = await dispatch('auth/getMembers')
  if (!success) TOAST_EL.value.open('error', error)
}

/* 회원 정보 수정 : modal */
const onUpdateMember = (member) => {
  commit('auth/SET_EDIT_MEMBERS', member)
  ACCOUNT_EL.value.open('admin-update')
}

/* 현재 체크박스 선택된 멤버들 */
const checkedMember = () => {
  let checkedMembers = CHECKBOX_EL.value.filter((checkbox) => checkbox.checked)

  for (const member of checkedMembers) {
    const m = members.value.at(member.dataset.index)
    commit('auth/SET_EDIT_MEMBERS', { _id: m._id, nickname: m.nickname, isActive: m.isActive })
  }
}

/* 체크된 항목 active 변경 */
const onUpdateActive = (active) => {
  if (CHECKBOX_EL.value.some((checkbox) => checkbox.checked)) {
    checkedMember()
    commit('auth/EDIT_MEMBERS_ACTIVE', active)
    updateMembers(editMembers.value, active)
  } else {
    alert('선택된 항목이 없습니다.')
  }
}

/* 회원 정보 수정 : checkbox */
const updateMembers = async (payload, active) => {
  const { success, error } = await dispatch('auth/updateMembers', payload)
  if (success) {
    TOAST_EL.value.open(
      'success',
      payload.length > 1 ? `${payload.at(0).nickname}님 외 ${payload.length - 1}명이 ${active ? '활성' : '정지'} 되었습니다.` : `${payload.at(0).nickname}님이 ${active ? '활성' : '정지'} 되었습니다`,
    )
    resetCheckbox()
  } else {
    TOAST_EL.value.open('error', error)
  }
}

/* 체크박스 초기화 */
const resetCheckbox = () => {
  CHECKBOX_EL.value.forEach((checkbox) => (checkbox.checked = false))
}

await getMembers()
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../scss/table.scss';
.wrap_table {
  display: table;
  font-size: 1.4rem;
  width: 100%;

  .avatar {
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border3);
}

.role {
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  margin: 0 0.4rem 0 0;

  &:last-child {
    margin: 0;
  }

  &.ADMIN {
    background-color: var(--error-light);
    color: var(--error);
  }
  &.USER {
    background-color: #ececec;
    color: var(--text4);
  }
}
}

.wrap_btns {
  @include flex-right;
  margin:2.4rem 0 0;

  .btn {
    margin: 0 0 0 0.8rem;
  }
}
</style>
