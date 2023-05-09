<template>
  <Toolbar
    :main="main"
    :sub="sub"
    :type="$store.state.menu.type"
    :categories="$store.state.menu.categories"
    @updateType="$store.commit('menu/SET_TYPE', $event)"
    @updateCategory="$store.commit('menu/SET_CATEGORY', $event)" />

  <div v-if="error">
    {{ error }}
  </div>

  <Suspense v-else>
    <template #default>
      <Posts v-if="$store.state.menu.type !== 'slide'" :main="main" :sub="sub" :category="$store.state.menu.category" :type="$store.state.menu.type" />
      <ul v-else class="wrap_slides">
        <li v-for="category in $store.state.menu.categories" :key="category">
          <Posts :main="main" :sub="sub" :category="category" :type="$store.state.menu.type" />
        </li>
      </ul>
    </template>

    <template #fallback>
      <ul :id="$store.state.menu.type">
        <component v-for="skeleton in 9" :key="skeleton" :is="LAYOUTS[$store.state.menu.type]"></component>
      </ul>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import Posts from '../../components/Posts.vue'
import Toolbar from '../../components/Toolbar.vue'
import Card from '../../components/slots/Card.vue'
import List from '../../components/slots/List.vue'
import Slide from '../../components/slots/Slide.vue'
import Recent from '../../components/slots/Recent.vue'

const LAYOUTS = {
  card: Card,
  list: List,
  slide: Slide,
  recent: Recent,
}

const props = defineProps({
  main: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: false,
  },
})

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err.message
  return true
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_slides > li {
  margin: 0 0 6.4rem;

  &:last-child {
    margin: 0;
  }
}
</style>
