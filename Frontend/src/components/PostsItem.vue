<template>
  <component :is="LAYOUTS[type]">
    <template #thumbnail>
      <div v-if="post.thumbnail" class="thumbnail">
        <router-link :to="{ name: 'post', params: { postId: post._id } }">
          <Image :src="post.thumbnail" />
        </router-link>

        <div class="ico_like" v-if="post.liked">
          <Ico :svg="'like-fill'" :color="'var(--likeActive-dark)'" />
        </div>
      </div>
      
      <div class="thumbnail" v-else :style="type === 'list' ? { display: 'none', width: '0' } : ''">
        <Image :src="DEFAULT_THUMBNAIL" />
      </div>
    </template>

    <template #category>
      <span>{{ post.category }}</span>
    </template>

    <template #title>
      <router-link :to="{ name: 'post', params: { postId: post._id } }" :aria-label="post.title">
        {{ post.title }}
      </router-link>
    </template>

    <template #lock_ico>
      <span class="wrap_ico_lock">
        <Ico v-if="!post.isPublic" class="ico_lock" :size="'sm'" :svg="'lock'" :color="type === 'slide' ? '#fff' : 'var(--text2)'"/>
      </span>
    </template>

    <template #summary>
      <p>{{ markdownText(post.content) }}</p>
    </template>

    <template #author>
      <span class="by">by.</span>
      <span class="nickname">{{ post.author.nickname }}</span>
    </template>

    <template #createdAt>
      <span>{{ getTime(post.createdAt) }}</span>
    </template>

    <template #comment_count>
      <router-link :to="{ name: 'post', params: { postId: post._id } }" @click="$store.commit('post/SET_QUICKMOVE', true)">
        댓글 {{ post.commentCount }}
      </router-link>
    </template>

    <template #like_count>
      <span>좋아요 {{ post.likeCount }}</span>
    </template>
  </component>
</template>

<script setup>
import markdownText from 'markdown-to-text'
import Card from './slots/Card.vue'
import List from './slots/List.vue'
import Slide from './slots/Slide.vue'
import Recent from './slots/Recent.vue'
import DEFAULT_THUMBNAIL from '../assets/default_thumbnail.webp'
import { getTime } from '../common/time.js'

const props = defineProps({
  type: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
  },
  post: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

const LAYOUTS = {
  card: Card,
  list: List,
  slide: Slide,
  recent: Recent,
}
</script>
