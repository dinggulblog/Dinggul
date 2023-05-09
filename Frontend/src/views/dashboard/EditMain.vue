<template>
  <PopupModal ref="POPUP_EL">
    <div class="wrap_edit-menu">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_menu">
        <h2 v-if="!editState">{{ menu.main }}</h2>
        <input v-else type="text" v-model="mainName" ref="INPUT_NAME_EL" />
        <Button size="sm" shape="line-round" theme="primary" @click="onEdit">{{ !editState ? '이름 변경' : '변경 완료' }}</Button>
      </div>

      <div class="wrap_sub">
        <label>서브 메뉴</label>
        <ul>
          <li v-for="(menu, idx) in $store.state.menu.editMenus" :key="idx" :data-index="idx">
            <span>{{ menu.sub }}</span>
            <span class="btn_del" @click="() => onDelSubMenu(idx)">❌</span>
          </li>
        </ul>

        <label>서브 메뉴 추가</label>
        <div class="wrap_add-sub">
          <input label="서브명" type="text" v-model="subName" />
          <Button size="sm" shape="line-round" theme="primary" @click="onCreateMenu">추가</Button>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, inject, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import PopupModal from '../../components/ui/PopupModal.vue'

const { state, commit, dispatch } = useStore()
const menu = computed(() => state.menu.editMenus.at(0))

const TOAST_EL = inject('TOAST_EL')
const POPUP_EL = ref(null)
const INPUT_NAME_EL = ref(null)

const editState = ref(false)
const mainName = ref(menu.value.main)

const subName = ref(null)

const onEdit = async () => {
  if (!editState.value) {
    editState.value = true
    await nextTick()
    INPUT_NAME_EL.value.focus()
  } else {
    mainName.value ? onUpdateMenu() : TOAST_EL.value.open('error', '메뉴명을 입력해주세요.')
  }
}

const onUpdateMenu = async () => {
  const { success, error } = await dispatch('menu/updateMenu', {
    menuId: menu.value._id,
    payload: { main: mainName.value },
  })
  if (success) {
    commit('menu/SET_EDIT_MENUS', state.menu.menus[mainName.value])
    TOAST_EL.value.open('success', '메뉴 변경이 완료되었습니다.')
    editState.value = false
  } else {
    TOAST_EL.value.open('error', error)
  }
}

const onCreateMenu = async () => {
  if (subName.value) {
    const { success, error } = await dispatch('menu/createMenu', { main: menu.value.main, sub: subName.value })
    if (success) {
      TOAST_EL.value.open('success', `${subName.value} 메뉴가 추가되었습니다.`)
      subName.value = null
    } else {
      TOAST_EL.value.open('error', error)
    }
  } else {
    TOAST_EL.value.open('error', '서브명을 입력해주세요.')
  }
}

const onDelSubMenu = async (idx) => {
  const { success, error } = await dispatch('menu/deleteMenu', {
    menuId: state.menu.editMenus.at(idx)._id,
  })
  if (success) {
    TOAST_EL.value.open('success', `${state.menu.editMenus.at(idx).sub} 메뉴가 삭제되었습니다.`)
    commit('menu/SET_EDIT_MENUS', state.menu.menus[menu.value.main])
  } else {
    TOAST_EL.value.open('error', error)
  }
}

const open = () => {
  POPUP_EL.value?.open()
}

const close = () => {
  POPUP_EL.value?.close()
}

defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_edit-menu {
  background: #fff;
  padding: 3.2rem 3.2rem;
  font-size: 1.4rem;
  color: var(--text4);
  width: 37rem;
  border-radius: 3.2rem;
  overflow-y: auto;

  @include mobile {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  label {
    color: var(--primary);
  }

  .wrap_btn-close {
    @include flex-right;
    margin: 0 0 2.4rem;
  }

  .wrap_menu {
    @include flex;
    border-bottom: 1px solid var(--border2);
    padding: 0 0 1rem;

    h2 {
      text-transform: uppercase;
      width: 78%;
    }

    input {
      text-transform: uppercase;
      width: 78%;
      font-size: 1.5em;
      padding: 0 1.2rem 0 0;
    }
  }

  .wrap_sub {
    padding: 3.2rem 0 0;

    ul {
      margin: 0 0 3.2rem 0;
      li {
        margin: 1.6rem 0 0;
        font-size: 1.4rem;
        cursor: pointer;

        .btn_del {
          margin: 0 0 0 0.4rem;
        }
      }
    }
  }

  .wrap_add-sub {
    @include flex($ai: initial);
    margin:0.8rem 0 0 0;

    input {
      flex: auto;
      border-bottom: 1px solid #ddd;
      margin: 0 1.2rem 0 0;
    }
  }
}
</style>
