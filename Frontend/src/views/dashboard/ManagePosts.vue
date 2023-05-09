<template>
  <div class="posts-list">
    <div class="wrap_table">
      <div class="table-header">
        <div class="table-head" v-for="head in tableHeads" :key="head">
          {{ head }}
        </div>
      </div>

      <div class="table-body">
        <div class="table-row" v-for="(post, idx) in posts" :key="idx">
          <div class="table-cell">
            <input type="checkbox" ref="CHECKBOX_EL" :data-index="idx" class="checkbox" aria-label="checkbox"/>
          </div>

          <div class="table-cell">
            <router-link :to="{ name: 'post', params: { postId: post._id } }" class="a_title">
              {{ post.title }}
            </router-link>
          </div>

          <div class="table-cell">
            <span class="author">{{ post.author.nickname }}</span>
          </div>

          <div class="table-cell">
            <span class="location">위치</span>
          </div>

          <div class="table-cell">
            <span class="category">{{ post.category }}</span>
          </div>

          <div class="table-cell">
            <span class="likeCount">{{ post.likeCount ? post.likeCount : '0' }}</span>
          </div>

          <div class="table-cell">
            <span class="commentCount">{{ post.commentCount ? post.commentCount : '0' }}</span>
          </div>

          <div class="table-cell">
            <span class="createdAt">{{ getTime(post.createdAt) }}</span>
          </div>

          <div class="table-cell">
            <span class="updatedAt">{{ getTime(post.updatedAt) }}</span>
          </div>

          <div class="table-cell">
            <span class="isActive">{{ post.isActive ? '활성' : '비활성' }}</span>
          </div>

          <div class="table-cell">
            <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.KEBAB_SLOT_EL[idx].onToggle()" aria-label="option"/>

            <Kebab ref="KEBAB_SLOT_EL" :dropboxItems="{ '게시글 수정': () => onUpdatePost(post._id) }" />
          </div>
        </div>
        <Observer :page="page" @update="onUpdatePage"></Observer>
      </div>
    </div>

    <div class="wrap_btns">
      <Button :shape="'line-round'" :size="'sm'" @click="() => onUpdateActive(true)" class="btn_active-member">게시 활성</Button>
      <Button :shape="'line-round'" :size="'sm'" @click="() => onUpdateActive(false)" class="btn_block-member">게시 정지</Button>
      <Button :shape="'line-round'" :size="'sm'" @click="onUpdatePosts" class="btn_move">게시물 이동</Button>
    </div>

    <MovePosts ref="MOVE_POSTS_EL" />
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getTime } from '../../common/time.js'
import Observer from '../../components/global/Observer.vue'
import MovePosts from '../dashboard/MovePosts.vue'

const { state, dispatch, commit } = useStore()
const { push } = useRouter()

const TOAST_EL = inject('TOAST_EL')
const CHECKBOX_EL = ref(null)
const MOVE_POSTS_EL = ref(null)

const tableHeads = ref(['선택', '글 제목', '작성자', '위치', '카테고리', '좋아요', '댓글 수', '등록일', '수정일', '상태', '옵션'])

const posts = ref([])
const maxCount = ref(1)
const page = ref(1)

const limit = ref(5)
const maxPage = computed(() => Math.ceil(maxCount.value / limit.value))

const main = ref(null)
const sub = ref(null)
const category = ref('전체')
const sort = ref(null)
const searchText = ref(null)

const editPosts = computed(() => state.post.editPosts)

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
    searchText: searchText.value,
  }

  Object.entries(subQuery).forEach(([key, value]) => {
    if (value) query[key] = value
  })

  const res = await dispatch('post/getPosts', query)

  if (!res.success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

  if (res.maxCount) maxCount.value = res.maxCount
  posts.value.splice((curPage - 1) * limit.value, limit.value, ...res.posts)
}

/* 단일 post 수정 : editor */
const onUpdatePost = (id) => {
  if (!id) return
  push({ name: 'editor', query: { postId: id } })
}

/* 다중 게시글 이동 : modal */
const onUpdatePosts = () => {
  checkedPosts()
  MOVE_POSTS_EL.value.open()
}

/* 현재 체크박스 선택된 게시글 */
const checkedPosts = () => {
  let checkedPosts = CHECKBOX_EL.value.filter((checkbox) => checkbox.checked)

  for (const post of checkedPosts) {
    const p = posts.value.at(post.dataset.index)
    
    commit(checkedPosts.length > 1 ? 'post/SET_EDIT_POSTS' : 'post/SET_POST', { 
      _id: p._id,
      main: p.main,
      sub: p.sub,
      category: p.category,
      isActive: p.isActive
    })
  }
}

/* 체크된 항목 active 변경 */
const onUpdateActive = (active) => {
  if (CHECKBOX_EL.value.some((checkbox) => checkbox.checked)) {
    checkedPosts()
    commit('post/ACTIVE_EDIT_POSTS', active)
    updatePosts()
  } else {
    alert('선택된 항목이 없습니다.')
  }
}

/* 다중 게시글 수정 : checkbox */
const updatePosts = async () => {
  const { success, error } = await dispatch('post/updatePosts', editPosts.value)
  if (success) {
    TOAST_EL.value.open('success', '게시글이 변경되었습니다.')
    resetCheckbox()
  } else {
    TOAST_EL.value.open('error', error)
  }
}

/* 체크박스 초기화 */
const resetCheckbox = () => {
  CHECKBOX_EL.value.forEach((checkbox) => (checkbox.checked = false))
}

await getPosts()
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../scss/table.scss';
.wrap_table {
  display: table;
  font-size: 1.4rem;
  width: 100%;

  .table-cell {
    padding: 2.4rem 1.6rem;
  }
}

.wrap_btns {
  @include flex-right;
  margin:2.4rem 0 0;

  .btn {
    margin: 0 0 0 0.8rem;
  }
}
</style>
