<template>
  <PopupModal ref="POPUP_EL">
    <div class="wrap_move-posts">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_menu">
        <div class="main">
          <select v-model="main" @change="onChangeMainMenu">
            <option selected disabled hidden :value="''">메뉴 선택</option>
            <option v-for="main in Object.keys($store.state.menu.menus)" :key="main">{{ main }}</option>
          </select>
        </div>

        <div class="sub">
          <select required v-model="sub" :disabled="!main" @change="onChangeSubMenu">
            <option selected disabled hidden :value="''">게시판 선택</option>
            <template v-if="main">
              <option v-for="{ sub } in $store.state.menu.menus[main]" :key="sub" :value="sub">{{ sub }}</option>
            </template>
          </select>
        </div>

        <div class="category">
          <select v-model="category" :disabled="!sub">
            <option selected disabled hidden :value="''">카테고리 선택</option>
            <template v-if="sub">
              <option v-for="category in $store.state.menu.categories" :key="category" :value="category">{{ category }}</option>
            </template>
          </select>
        </div>
      </div>

      <Button shape="fill-round-full" theme="primary" @click="onUpdatePosts" class="btn-submit">게시물 이동하기</Button>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import PopupModal from '../../components/ui/PopupModal.vue'

const { state, commit, dispatch } = useStore()

const editPosts = computed(() => state.post.editPosts)

const TOAST_EL = inject('TOAST_EL')
const POPUP_EL = ref(null)

const main = computed({
  get: () => state.post.main ?? '',
  set: (value) => commit('post/SET_MAIN', value),
})
const sub = computed({
  get: () => state.post.sub ?? '',
  set: (value) => commit('post/SET_SUB', value),
})
const category = computed({
  get: () => state.post.category ?? '',
  set: (value) => commit('post/SET_CATEGORY', value),
})

const onChangeMainMenu = () => {
  document.body.querySelector('div.sub select').selectedIndex = 0
  document.body.querySelector('div.category select').selectedIndex = 0
}

const onChangeSubMenu = () => {
  document.body.querySelector('div.category select').selectedIndex = 0
}

const setPayload = () => {
  commit('post/CHANGE_EDIT_POSTS')
}

const onUpdatePosts = async () => {
  setPayload()
  const { success, error } = await dispatch('post/updatePosts', editPosts.value)
  if (success) {
    TOAST_EL.value.open('success', '게시물 이동이 완료되었습니다.')
    close()
  } else {
    TOAST_EL.value.open('error', error)
  }
}

const open = () => {
  POPUP_EL.value?.open()
}

const close = () => {
  POPUP_EL.value?.close()
  commit('post/UNSET_POST')
}

defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_move-posts {
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
    margin:0 0 3.2rem;

    div {
      width:100%;
      border-bottom: 1px solid var(--border2);
      padding: 0 0 1.6rem;
      margin:1.6rem 0 0;
    }

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
        cursor: pointer;

        .btn_del {
          margin: 0 0 0 0.4rem;
        }
      }
    }
  }

  .wrap_add-sub {
    @include flex($ai: initial);
    margin: 0.8rem 0 0 0;

    input {
      flex: auto;
      border-bottom: 1px solid #ddd;
      margin: 0 1.2rem 0 0;
    }
  }
}
</style>
