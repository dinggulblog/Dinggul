<template>
  <PopupModal ref="POPUP_EL">
    <div class="wrap_add-menu">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <h2>Create Main Menu</h2>

      <div class="wrap_menu">
        <label>메인 메뉴 이름</label>
        <input type="text" v-model="mainName" ref="INPUT_NAME_EL" />

        <label>서브 메뉴 이름</label>
        <input type="text" v-model="subName" />

        <div class="wrap_categories">
          <ul v-if="categories.length">
            <label>카테고리</label>
            <li v-for="(category, idx) in categories" :key="idx" :data-index="idx">
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
      </div>

      <Button shape="fill-round-full" theme="primary" @click="onCreateMenu" class="btn-submit">생성하기</Button>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import PopupModal from '../../components/ui/PopupModal.vue'

const { dispatch } = useStore()

const TOAST_EL = inject('TOAST_EL')
const POPUP_EL = ref(null)
const INPUT_NAME_EL = ref(null)

const mainName = ref(null)
const subName = ref(null)
const categoryName = ref(null)

const categories = ref([])

const onAddCategory = () => {
  if (categoryName.value && mainName.value && subName.value) {
    categories.value.push(categoryName.value)
    categoryName.value = null
  } else {
    TOAST_EL.value.open('error', `${mainName.value && subName.value ? '카테고리명을 입력해주세요.' : 'main, sub는 필수 항목입니다.'}`)
  }
}

const onDelCategory = (idx) => {
  categories.value.splice(idx, 1)
}

const onCreateMenu = async () => {
  if (mainName.value && subName.value) {
    const { success, error } = await dispatch('menu/createMenu', { main: mainName.value, sub: subName.value, categories: categories.value })
    if (success) {
      TOAST_EL.value.open('success', `${mainName.value} 메뉴가 추가되었습니다.`)
      close()
    } else {
      TOAST_EL.value.open('error', error)
    }
  } else {
    TOAST_EL.value.open('error', 'main, sub는 필수 항목입니다.')
  }
}

const open = async () => {
  POPUP_EL.value?.open()
  await nextTick()
  INPUT_NAME_EL.value.focus()
}

const close = () => {
  POPUP_EL.value?.close()
  mainName.value = null
  subName.value = null
  categories.value = []
}

defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_add-menu {
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

  h2 {
    @include flex($jc: center);
    color: var(--primary);
    margin:0 0 3.2rem;
    font-weight: 500;
  }

  label {
    color: var(--text4);
    font-weight: 500;
  }

  .wrap_btn-close {
    @include flex-right;
    margin: 0 0 1.2rem;
  }

  .wrap_menu {
    @include flex(column, $ai: start);

    input {
      width: 100%;
      text-transform: uppercase;
      font-size: 1.4rem;
      padding: 0 0 1.2rem 0;
      margin: 0.8rem 0 3.2rem;
      border-bottom: 1px solid var(--border2);
    }
  }

  .wrap_categories {
    width:100%; 
    
    input {
      width: 78%;
    }

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

      label {
        color: var(--primary);
      }
    }
  }

  .wrap_add-category {
    @include flex;
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
