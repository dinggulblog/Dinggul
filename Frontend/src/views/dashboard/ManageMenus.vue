<template>
  <div class="wrap_menus">
    <ul class="ul_menus">
      <li v-for="(value, key) in menus" :key="key" class="menu" @click="() => onSetLayout('edit-main', value)">
        <span class="span_main">💜 {{ key }}</span>
        <ul>
          <li v-for="v in value" :key="v.sub" class="sub" @click.stop="() => onSetLayout('edit-sub', v)">
            <span class="span_sub">📁 {{ v.sub }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="wrap_layout" v-if="key">
      <component :is="LAYOUTS[key]" ref="LAYOUT_EL" />
    </div>

    <div class="wrap_btns">
      <Button shape="line-round" theme="primary" @click="() => onSetLayout('add-menu')" class="btn-submit">메인 메뉴 생성</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import AddMenu from './AddMenu.vue'
import EditMain from './EditMain.vue'
import EditSub from './EditSub.vue'

const { state, commit } = useStore()
const menus = computed(() => state.menu.menus)

const LAYOUTS = {
  'add-menu': AddMenu,
  'edit-main': EditMain,
  'edit-sub': EditSub,
}

const LAYOUT_EL = ref(null)
const key = ref(null)

const onSetLayout = async (k, menus) => {
  key.value = k
  if (menus) commit('menu/SET_EDIT_MENUS', menus)
  await nextTick()
  LAYOUT_EL.value.open()
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_menus {
  color: var(--text4);

  .ul_menus {
    width: 24rem;
    border: 1px solid #ddd;
    border-radius: 1.2rem;
    padding: 1.6rem 0 0;
  }

  ul > li {
    font-size: 1.4rem;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;

    & > ul {
      margin: 1.6rem 0 0;

      li {
        padding: 0 2.4rem;
      }
    }
  }
  .menu {
    &:not(:last-child) {
      border-bottom: 1px solid #ddd;
      margin: 0 0 1.6rem 0;
    }

    .span_main {
      margin: 0 0 0 2.4rem;
      font-weight: 700;
    }
  }
  .sub {
    padding: 1.6rem 0 1.6rem 6.4rem;
    border-top: 1px dashed #ddd;
    width: calc(24rem - 6.4rem);
  }
  .wrap_btns {
    margin: 2.4rem 0 0;
  }
}
</style>
