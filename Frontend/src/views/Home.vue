<template>
  <div class="home">
    <div v-if="error">
      {{ error }}
    </div>

    <template v-else>
      <!-- Trending Posts -->
      <div class="recent_tranding">
        <h2 class="h2_recent_tranding">Tranding Posts</h2>
        <ul class="recent_tranding_sort_btns">
          <li><Button class="btn_sort_view" :theme="sort === 'view' ? 'primary' : ''" @click="onChangeSort('view')">조회수순</Button></li>
          <li><Button class="btn_sort_like" :theme="sort === 'like' ? 'primary' : ''" @click="onChangeSort('like')">좋아요순</Button></li>
        </ul>
        <Suspense>
          <template #default>
            <Posts :type="'recent'" :recent="true" :sort="sort" />
          </template>
          <template #fallback>
            <ul :id="'recent'">
              <Recent v-for="skeleton in 6" :key="skeleton" />
            </ul>
          </template>
        </Suspense>
      </div>

      <!-- Recent reviewd Sol Posts -->
      <h2 class="h2_recent_review_sol">Recent Review Posts by SOL</h2>
      <Suspense>
        <template #default>
          <Posts :main="Object.keys($store.state.menu.menus)[0]" :type="'slide'" :recent="true" />
        </template>
        <template #fallback>
          <ul :id="'slide'">
            <Slide v-for="skeleton in 4" :key="skeleton" />
          </ul>
        </template>
      </Suspense>

      <!-- Recent reviewd Ming Posts -->
      <h2 class="h2_recent_review_ming">Recent Review Posts by MING</h2>
      <Suspense>
        <template #default>
          <Posts :main="Object.keys($store.state.menu.menus)[1]" :type="'slide'" :recent="true" />
        </template>
        <template #fallback>
          <ul :id="'slide'">
            <Slide v-for="skeleton in 4" :key="skeleton" />
          </ul>
        </template>
      </Suspense>
    </template>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import Posts from '../components/Posts.vue'
import Slide from '../components/slots/Slide.vue'
import Recent from '../components/slots/Recent.vue'

const error = ref(null)
const sort = ref('view')

const onChangeSort = (type) => {
  sort.value = type
}

onErrorCaptured((err) => {
  error.value = err
  return true
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.home {
  font-size: 1.4rem;
  color: var(--text3);

  h2 {
    margin: 6.4rem 0 3.2rem 0;
    color: var(--primary);

    &:first-child {
      margin: 0 0 3.2rem 0;
    }
  }

  &:deep(#recent) {
    flex-wrap: wrap;
    @include flex;
  }

  &:deep(.recent_item) {
    width: 56.4rem;
    margin-right: 2.4rem;

    @include tablet_landscape {
      width: calc(100% / 2 - 2.4rem);
      margin-right: 2.4rem;
    }

    @include tablet {
      width: 100%;
      margin-right: 0;
    }

    @include mobile {
      width: 100%;
      margin-right: 0;
    }

    &:nth-child(2n) {
      margin-right: 0;
    }
  }

  .recent_tranding_sort_btns {
    @include flex;
    margin-bottom: 3.2rem;

    li:first-child {
      margin-right: 0.8rem;
    }

    &:deep(.btn) {
      position: relative;

      &::after {
        padding-bottom: 2rem;
        border-bottom: solid 0.1rem var(--primary);
        content: '';
        inset: 0;
        @include position(absolute, $z: -1);
        transform: scaleX(0);
        transition: transform 0.25s ease-in;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }

    .btn_sort_like {
      margin: 0 0 0 0.4rem;
    }
  }
}
</style>
