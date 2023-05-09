<template>
  <div class="wrap_posts">
    <Slider 
      v-if="type === 'slide' && !isMobileDevices"
      :target="POST_EL"
      :limit="limit"
      :recent="recent"
      :category="category"
      :maxCount="recent ? Math.min(maxCount, 8) : maxCount"
    />

    <!-- List of Posts -->
    <div class="posts">
      <ul :id="type" ref="POST_EL">
        <template v-if="posts.length">
          <TransitionGroup name="fade_up" @before-enter="beforeEnter" @after-enter="afterEnter" @enter-cancelled="afterEnter">
            <template v-for="(post, index) in posts" :key="index">
              <PostsItem :type="type" :post="post" :data-index="index" />
            </template>
            <li v-if="!recent"><Observer :page="page" @update="onUpdatePage"></Observer></li>
          </TransitionGroup>
        </template>
        <li v-else><p class="empty_posts">게시물이 존재하지 않습니다.</p></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, toRefs, computed, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import PostsItem from './PostsItem.vue'
import Observer from './global/Observer.vue'
import Slider from './Slider.vue'

const LIMIT_TYPE = {
  list: 10,
  card: 9,
  slide: 8,
  recent: 6,
}

const props = defineProps({
  main: {
    type: String,
  },
  sub: {
    type: String,
  },
  category: {
    type: String,
    default: '전체',
  },
  recent: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
  },
  sort: {
    type: String,
    required: false,
    validator: (value) => ['view', 'like'].includes(value),
  },
  filter: {
    type: String,
    required: false,
    validator: (value) => ['like', 'comment'].includes(value),
  },
  userId: {
    type: String,
    required: false,
  },
  searchText: {
    type: String,
    required: false,
  }
})
const { dispatch } = useStore()
const { main, sub, category, type, sort, filter, userId, searchText } = toRefs(props)

const isMobileDevices = inject('isMobileDevices')
const POST_EL = ref(null)

const posts = ref([])
const page = ref(1)
const maxCount = ref(0)
const limit = computed(() => LIMIT_TYPE[type.value])
const maxPage = computed(() => Math.ceil(maxCount.value / limit.value))

const onUpdatePage = (newPage) => {
  if (maxPage.value < newPage) return
  
  page.value = newPage
  getPosts(newPage)
}

const getPosts = async (curPage) => {
  const query = {
    skip: (page.value - 1) * limit.value,
    limit: limit.value,
    category: category.value,
  }

  const subQuery = {
    main: main.value,
    sub: sub.value,
    sort: sort.value,
    filter: filter.value,
    userId: userId.value,
    searchText: searchText.value
  }

  Object.entries(subQuery).forEach(([key, value]) => {
    if (value) query[key] = value
  })

  const res = await dispatch('post/getPosts', query)

  if (!res.success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

  if (res.maxCount) maxCount.value = res.maxCount
  posts.value.splice((curPage - 1) * limit.value, limit.value, ...res.posts)
}

const beforeEnter = (el) => {
  el.style.transitionDelay = 150 * parseInt(el.dataset.index % limit.value, 10) + 'ms'
}

const afterEnter = (el) => {
  el.style.transitionDelay = ''
}

watch([main, sub, category, sort, filter, userId, searchText], () => {
  posts.value = []
  maxCount.value = 0
  page.value = 1
  getPosts(1)
})

watchEffect(() => {
  if (POST_EL.value && isMobileDevices.value && type.value === 'slide') {
    POST_EL.value.style.overflowX = 'auto'
  }
})

await getPosts(1)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_posts {
  @include position;

  .posts {
    overflow-x: clip;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    .empty_posts {
      font-size: 1.4rem;
      color: var(--text3);
      text-transform: capitalize;
    }
  }
}
</style>
