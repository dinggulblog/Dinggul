<template>
  <div class="dashboard">
    <ul class="ul_chips">
      <li v-for="(value, key) in CHIPS" :key="key" class="chip">
        <router-link :to="{ name: 'dashboard', params: { section: key } }" custom v-slot="{ navigate }">
          <span @click="navigate" :data-set="key" role="link" ref="CHIP_EL">{{ value }}</span>
        </router-link>
      </li>
    </ul>

    <Suspense>
      <template #default>
        <component :is="LAYOUTS[section]" />
      </template>
      <template #fallback> 부르는 중.. </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import Chart from './Chart.vue'
import Members from './Members.vue'
import ManagePosts from './ManagePosts.vue'
import ManageMenus from './ManageMenus.vue'

const LAYOUTS = {
  chart: Chart,
  members: Members,
  'manage-posts': ManagePosts,
  'manage-menus': ManageMenus,
}

const CHIPS = {
  chart: '통계',
  members: '회원 목록',
  'manage-posts': '포스팅 관리',
  'manage-menus': '메뉴 설정',
}

const props = defineProps({
  section: {
    type: String,
    required: true,
  },
})

const CHIP_EL = ref(null)

watchEffect(() => {
  if (CHIP_EL.value) {
    CHIP_EL.value.forEach((el) => {
      el.classList.remove('on')
      if (el.dataset.set === props.section) el.classList.add('on')
    })
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dashboard {
  .ul_chips {
    @include flex;
    margin: 0 0 3.2rem;

    li { 
      margin: 0 0.8rem 0 0;
      padding: 0.8rem 1.2rem;
      border-radius: 1.6rem;
      font-size: 1.4rem;
      letter-spacing: 0.1rem;
      background-color: #ededed;
      color: var(--text4);
      cursor: pointer;

      &:last-child {
        margin: 0;
      }
    }

    span {

      &.on {
        color: var(--primary);
        font-weight: 500;
      }
    }
  }
}
</style>
