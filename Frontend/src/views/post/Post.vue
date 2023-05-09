<template>
  <div class="post" v-if="post">
    <div class="wrap_header">
      <div class="wrap_left">
        <!-- Post Title -->
        <div class="wrap_title">
          <div class="title">
            <h2>{{ post.title }}</h2>
            <span v-if="!post.isPublic" class="ico_lock">
              <Ico :svg="'lock'" :color="'var(--text2)'" />
            </span>
          </div>
        </div>

        <!-- Post Info -->
        <div class="wrap_info">
          <Info>
            <template #createdAt>
              <li>
                <span class="createdAt">{{ getTime(post.createdAt) }}</span>
              </li>
            </template>
            <template #category>
              <li>
                <span class="category">{{ post.category }}</span>
              </li>
            </template>
          </Info>
        </div>
      </div>
      <!-- wrap_left end -->

      <div class="wrap_right">
        <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.KEBAB_EL.onToggle()" aria-label="option" />
        <Kebab
          ref="KEBAB_EL"
          :dropboxItems="
            !auth ? { '링크 복사': onCopyLink } : { '글 수정': () => $router.push({ name: 'editor', query: { postId: $store.state.post.post._id } }), '글 삭제': onDeletePost, '링크 복사': onCopyLink }
          " />
      </div>
      <!-- wrap_right end -->
    </div>
    <!-- wrap_header end -->

    <!-- Post Content -->
    <div class="content" ref="CONTENT_EL">
      <MdEditor previewOnly :modelValue="post.content" @onHtmlChanged="updated" />
    </div>

    <!-- Post Likes -->
    <div class="wrap_like">
      <div class="liked_count">
        <Ico class="ico_like" :svg="'like-fill'" :color="!post.liked ? 'var(--disable)' : 'var(--likeActive)'" @click="onUpdateLike" />
        <span>{{ post.likeCount }}</span>
      </div>
    </div>

    <!-- Author Profile -->
    <div class="wrap_author">
      <User :profile="post.author" />
      <router-link v-if="post.author" :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link"> 프로필 보러가기 </router-link>
    </div>

    <!-- Link to another Post -->
    <div class="wrap_link">
      <div v-for="linkedPost in post.linkedPosts" :key="linkedPost?._id" class="link">
        <span v-if="linkedPost.rel === 'prev'">이전글</span>
        <span v-else>다음글</span>
        <Button class="btn_link" @click="() => $router.push({ name: 'post', params: { postId: linkedPost._id } })"> {{ linkedPost.title }} </Button>
      </div>
    </div>

    <!-- TOC -->
    <Teleport to="#content">
      <div class="wrap_toc">
        <ul class="toc">
          <li v-for="item in toc" :key="item">
            <a
              :href="'#' + item.getAttribute('id')"
              :class="item.getAttribute('id')"
              ref="TOC_EL"
              :style="item.tagName === 'H2' ? { marginLeft: '0.8rem' } : item.tagName === 'H3' ? { marginLeft: '1.6rem' } : ''"
              >{{ item.innerText }}</a
            >
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
  <!-- Post end -->

  <div class="comment">
    <!-- Comments Editor -->
    <CommentEditor :postId="postId" />

    <!-- Comments -->
    <div class="comments" ref="COMMENTS_EL">
      <h2>댓글 {{ $store.state.comment.commentCount }}개</h2>

      <ul class="comment_items">
        <Comment
          v-for="comment in $store.state.comment.comments"
          :key="comment._id"
          :postId="postId"
          :comment="comment"
          :isOwner="comment.commenter._id === $store.state.auth.user?._id"
          :isAuthor="post.author._id === $store.state.auth.user?._id" />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, nextTick, watch, onErrorCaptured, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import MdEditor from 'md-editor-v3'
import CommentEditor from '../../components/CommentEditor.vue'
import Comment from '../../components/Comment.vue'
import User from '../../components/User.vue'
import Info from '../../components/slots/Info.vue'
import { getTime } from '../../common/time'
import 'md-editor-v3/lib/style.css'

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

const { state, dispatch, commit } = useStore()

const DIALOG_EL = inject('DIALOG_EL')
const TOAST_EL = inject('TOAST_EL')

const CONTENT_EL = ref(null)
const COMMENTS_EL = ref(null)
const TOC_EL = ref(null)

const toc = ref(null)
const observedEl = ref(new Map())
const intersectEl = ref([])

const post = computed(() => state.post.post)
const auth = computed(() => state.auth.user && post.value.author?._id === state.auth.user._id)

const onDeletePost = async () => {
  const ok = await DIALOG_EL.value.show({
    title: '게시물 삭제',
    message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
  })

  if (ok) {
    const { success, error } = await dispatch('post/deletePost')
    if (!success) return TOAST_EL.value.open('error', error)
  }
}

const onUpdateLike = async () => {
  const { success, error } = !post.value.liked ? await dispatch('post/updateLike') : await dispatch('post/deleteLike')

  if (!success) TOAST_EL.value.open('error', error)
}

const onCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    TOAST_EL.value.open('success', '클립보드에 게시물 링크가 복사되었습니다')
  } catch {
    TOAST_EL.value.open('error', '링크 복사에 실패하였습니다.')
  }
}

const callback = (entries, observer) => {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      observedEl.value.set(entry.target.id, entry)
      intersectEl.value = [...observedEl.value.values()].filter((el) => el && el.isIntersecting)
      TOC_EL.value.forEach((el) => el.classList.remove('on'))
      if (intersectEl.value.length) {
        TOC_EL.value.find((el) => el.getAttribute('class') === intersectEl.value[0].target.id).classList.add('on')
      }
    } else {
      const idx = intersectEl.value.findIndex((el) => el.target.id === entry.target.id)
      if (idx !== -1) intersectEl.value.splice(idx, 1)
      observedEl.value.set(entry.target.id, entry)
      TOC_EL.value.forEach((el) => el.classList.remove('on'))
      if (intersectEl.value.length) {
        TOC_EL.value.find((el) => el.getAttribute('class') === intersectEl.value[0].target.id).classList.add('on')
      }
    }
  })
}

const observer = new IntersectionObserver(callback, { threshold: 0.5, rootMargin: '-114px 0px 0px 0px' })

const updated = async () => {
  await nextTick()
  observer.disconnect()
  observedEl.value.clear()
  toc.value = []
  intersectEl.value = []

  const tocElements = CONTENT_EL.value?.querySelectorAll('h1, h2, h3')

  if (tocElements?.length) {
    tocElements.forEach((el) => {
      document.getElementById('md-editor-v3-preview-wrapper').style.overflow = 'initial'
      el.style.scrollMarginTop = '11.4rem'
      toc.value = Array.from(tocElements).map((el) => el)
      observedEl.value.set(el.getAttribute('id'), null)
      observer.observe(el)
    })
  }
}

watch(
  props,
  async () => {
    const { success, error } = await dispatch('post/getPost', { postId: props.postId })
    if (!success) throw new Error(error)

    const { success: success2, error: error2 } = await dispatch('comment/getComments', { postId: props.postId })
    if (!success2) throw new Error(error2)

    document.title = post.value?.title

    if (state.post.quickMove && COMMENTS_EL.value) {
      COMMENTS_EL.value.scrollIntoView({ behavior: 'smooth' })
      commit('post/SET_QUICKMOVE', false)
    }
  },
  { immediate: true },
)

onBeforeMount(() => {
  commit('post/UNSET_POST')
  commit('comment/UNSET_COMMENTS')
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.post {
  .wrap_header {
    @include flex;

    .wrap_left {
      @include flex(column, $ai: start);
      flex-basis: 80%;
      padding: 0 0 0 2.4rem;
      border-left: 1px solid var(--primary);

      .wrap_title {
        margin-bottom: 2.4rem;
        .title {
          @include flex;

          h2 {
            font-size: 2rem;
            color: var(--text4);
            font-weight: 400;
            @include ellipsis(1);
            white-space: pre-wrap;
          }

          .ico_lock {
            margin: 0 0 0 1.6rem;
          }
        }
      }
    }

    .wrap_right {
      @include flex(column, $jc: center, $ai:end);
      flex-basis: 20%;
    }
  }

  .content {
    margin: 6.4rem 0;
    font-size: 1.4rem;
    color: var(--text3);
    line-height: 1.5;

    .markdown {
      p {
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .wrap_like {
    @include flex-col-center;

    .liked_count {
      @include flex-center;
      border: 1px solid var(--border3);
      border-radius: 3.2rem;
      padding: 0.6rem 1.2rem;

      span {
        color: var(--text2);
        font-size: 1.2rem;
      }

      .ico_like {
        margin-right: 0.8rem;
        cursor: pointer;
      }
    }

    .liked_user {
      ul > li {
        @include flex-col-center;

        img {
          border-radius: 50%;
          width: 3.6rem;
          height: 3.6rem;
          object-fit: cover;
        }

        span {
          font-size: 1.2rem;
          color: var(--text3);
          margin: 0.8rem 0 0;
        }
      }
    }
  }

  .wrap_author {
    @include position;
    margin: 6.4rem 0 0;

    &:deep(.user-info) {
      .wrap_avatar {
        .avatar {
          width: 9.6rem;
          height: 9.6rem;

          @include mobile {
            width: 6.4rem;
            height: 6.4rem;
          }
        }
      }
      .wrap_nickname_greetings {
        color: var(--text3);
        .nickname {
          font-size: 1.6rem;
          font-weight: 500;
          width: 10rem;
          @include ellipsis(1);
          word-break: break-all;
          color: var(--text3);
        }

        .greetings {
          margin: 1.6rem 0 0;
          font-size: 1.4rem;
          @include ellipsis(2);
          color: var(--text3);

          @include mobile {
            -webkit-line-clamp: 1;
          }
        }
      }
    }

    .a_link {
      @include position(absolute, $t: 0, $r: 0);
      font-size: 1.4rem;
      text-decoration: underline;
      color: var(--primary);
      margin: 0.3rem 0 0;
    }
  }

  .wrap_link {
    margin: 4.8rem 0 4.8rem;
    border-top: 1px solid var(--border2);

    .link {
      @include flex;
      padding: 1.6rem 0;
      width: 100%;

      &:first-child,
      &:last-child {
        border-bottom: 1px solid var(--border2);
      }

      span {
        font-size: 1.4rem;
        margin: 0 1.2rem 0 0;
        color: var(--primary);
        font-weight: 500;
        min-width: 4rem;
      }

      .btn_link {
        font-size: 1.4rem;
        @include ellipsis(1);
      }
    }
  }
}

.comment {
  .comments {
    margin: 6.4rem 0 0;
  }

  h2 {
    color: var(--primary);
    font-weight: 400;
    font-size: 1.6rem;
    margin: 0 0 3.2rem 0;
  }
}

.md-editor-content .md-editor-preview-wrapper {
  overflow: auto !important;
}

[class*='md-editor'] {
  overflow: initial !important;
}




</style>
