<template>
  <PopupModal ref="POPUP_EL">
    <div class="wrap_edit-menu">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_menu">
        <h2 v-if="!editState">{{ menu.sub }}</h2>
        <input v-else type="text" v-model="subName" ref="INPUT_NAME_EL" />
        <Button v-if="!editState" size="sm" shape="line-round" theme="primary" @click="onEdit"> {{ '이름 변경' }}</Button>
      </div>

      <div class="wrap_categories">
        <ul v-if="menu.categories.length">
          <label>카테고리</label>
          <li v-for="(category, idx) in menu.categories" :key="idx" :data-index="idx">
            <span>{{ category }}</span>
            <span class="btn_del" @click="() => onDelCategory(idx)">❌</span>
          </li>
        </ul>

        <label>카테고리 추가</label>
        <div class="wrap_add-category">
          <input label="카테고리명" type="text" v-model="categoryName" />
          <Button size="sm" shape="line-round" theme="primary" @click="onAddCategory">추가</Button>
        </div>
      </div>

      <Button shape="fill-round-full" theme="primary" @click="onUpdateMenu" class="btn-submit">수정 완료</Button>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, inject, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import PopupModal from '../../components/ui/PopupModal.vue'

const { state, dispatch, commit } = useStore()

const menu = computed(() => state.menu.editMenus)

const TOAST_EL = inject('TOAST_EL')
const POPUP_EL = ref(null)
const INPUT_NAME_EL = ref(null)

const editState = ref(false)
const subName = ref(menu.value.sub)
const categoryName = ref(null)

const onEdit = async () => {
  editState.value = true
  await nextTick()
  INPUT_NAME_EL.value.focus()
}

const onAddCategory = () => {
  if (categoryName.value) {
    commit('menu/ADD_CATEGORY', categoryName.value)
    categoryName.value = null
  } else {
    TOAST_EL.value.open('error', '카테고리명을 입력해주세요.')
  }
}

const onDelCategory = (idx) => {
  commit('menu/DEL_CATEGORY', idx)
}

const onUpdateMenu = async () => {
  if (subName.value) {
    const { success, error } = await dispatch('menu/updateMenu', {
      menuId: menu.value._id,
      payload: { sub: subName.value, categories: menu.value.categories },
    })
    if (!success) {
      TOAST_EL.value.open('error', error)
    } else {
      TOAST_EL.value.open('success', '메뉴가 변경되었습니다.')
      editState.value = false
      close()
    }
  } else {
    TOAST_EL.value.open('error', '서브명을 입력해주세요.')
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

  .wrap_categories,
  .wrap_sub {
    padding: 3.2rem 0 0;

    ul {
      margin: 0 0 3.2rem 0;
      li {
        margin: 1.6rem 0 0;
        font-size: 1.4rem;

        .btn_del {
          margin: 0 0 0 0.4rem;
          cursor: pointer;
        }
      }
    }
  }

  .wrap_add-category {
    @include flex($ai: initial);
    margin: 0.8rem 0 0;

    input {
      flex: auto;
      border-bottom: 1px solid #ddd;
      margin: 0 1.2rem 0 0;
    }
  }

  .btn-submit {
    margin: 3.2rem 0 0;
  }
}
</style>
