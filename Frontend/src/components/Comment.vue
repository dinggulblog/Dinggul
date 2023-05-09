<template>
  <li class="comment_item">
    <div class="wrap_item">
      <div class="wrap_header">
        <div class="wrap_left">
          
          <!-- Commenter -->
          <User :profile="comment.commenter" />

          <!-- Comment Info -->
          <Info>
            <template #createdAt>
              <li><span class="createdAt">{{ getTime(comment.createdAt) }}</span></li>
            </template>
          </Info>

          <!-- Reply Button -->
          <div class="wrap_reply_btn" v-if="comment.isActive && !!$store.state.auth.user">
            <Button
              class="btn_reply"
              :theme="'primary'"
              @click="!isOpenEditor ? onOpenEditor(false) : onCloseEditor()"
              aria-label="create reply">
              {{ !isOpenEditor ? '답글 작성' : '에디터 닫기' }}
            </Button>
          </div>

        </div><!-- wrap_left end -->

        <div class="wrap_right" v-if="comment.isActive">
          <Button
            class="btn_dropbox"
            :size="'sm'"
            :svg="'more'"
            @click="$refs.ACTION_SLOT_EL.onToggle()"
            aria-label="option"
          />
          <Kebab 
            ref="ACTION_SLOT_EL"
            :dropboxItems="!isOwner
              ? { '댓글 복사': onCopyComment }
              : { '댓글 복사': onCopyComment, '댓글 수정': () => onOpenEditor(true), '댓글 삭제': onDeleteComment }"
          />
        </div><!-- wrap_right end -->
      </div><!-- wrap_header end -->

      <!-- Content -->
      <div class="content">
        <p>
          <span v-if="parentComment" class="receiver">@ {{ parentComment?.commenter?.nickname }}</span>
          <Ico  v-if="!comment.isPublic" class="lock_ico" :size="'sm'" :svg="'lock'" :color="'var(--text2)'" />
          <span v-if="!comment.isActive"><i>*** 삭제된 댓글입니다. ***</i></span>
          <span v-else-if="!comment.isPublic && !isAuthor && !isOwner"><strong>비밀</strong> 댓글입니다. 게시물 작성자와 관리자만 볼 수 있어요.</span>
          <span v-else>{{ comment.content }}</span>
        </p>
        <Button
          v-if="comment.childCommentCount"
          class="btn_childComment_toggle"
          :svg="!isOpenChildren ? 'arrow-down' : 'arrow-up'"
          :size="'sm'"
          :theme="'primary'"
          @click="onToggleChildren"
          aria-label="open reply">
          {{ '답글 ' + comment.childCommentCount + '개' }}
        </Button>
      </div>

      <!-- Hided Editor -->
      <CommentEditor
        v-if="isOpenEditor"
        :id="comment._id"
        :postId="postId"
        @closeEditor="onCloseEditor"
      />
    </div><!-- wrap_item end -->

    <!-- Children Comments -->
    <ul class="comment_childItem" v-if="comment.childComments && isOpenChildren">
      <Comment
        v-for="childComment in comment.childComments"
        :key="childComment._id"
        :postId="postId"
        :comment="childComment"
        :isOwner="childComment.commenter._id === $store.state.auth.user?._id"
        :isAuthor="isAuthor"
      />
    </ul>
  </li>
</template>

<script setup>
  import { inject, ref, toRefs, computed } from 'vue'
  import { useStore } from 'vuex'
  import { getTime } from '../common/time.js'
  import Comment from './Comment.vue'
  import CommentEditor from './CommentEditor.vue'
  import User from './User.vue'
  import Info from './slots/Info.vue'

  const props = defineProps({
    postId: {
      type: String,
      required: true,
      default: '',
    },
    comment: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  })

  const { getters, dispatch, commit } = useStore()

  const DIALOG_EL = inject('DIALOG_EL')
  const TOAST_EL = inject('TOAST_EL')

  const { comment, postId, isOwner } = toRefs(props)
  const isOpenEditor = ref(false)
  const isOpenChildren = ref(false)
  const parentComment = computed(() => getters['comment/getParentComment'](comment.value?.parentComment))

  const onOpenEditor = (update = false) => {
    commit('comment/SET_COMMENT',{ update, comment: comment.value })
    isOpenEditor.value = true
  }

  const onCloseEditor = () => {
    isOpenEditor.value = false
  }

  const onToggleChildren = () => {
    isOpenChildren.value = !isOpenChildren.value
  }

  const onCopyComment = async () => {
    try {
      await navigator.clipboard.writeText(comment.value.content)
      TOAST_EL.value.open('success', '댓글 내용이 복사되었습니다')
    } catch {
      TOAST_EL.value.open('error', '댓글 내용 복사에 실패하였습니다.')
    }
  }

  const onDeleteComment = async () => {
    const ok = await DIALOG_EL.value.show({
      title: '댓글 삭제',
      message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
    })
    if (!ok) return

    const { success, error } = await dispatch('comment/deleteComment', {
      commentId: comment.value._id,
      postId: postId.value,
      isOwner: isOwner.value
    })

    success
      ? TOAST_EL.value.open('success', '댓글이 삭제되었습니다.')
      : TOAST_EL.value.open('error', error)
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment_items > li > ul {
    margin: -2.4rem 0 0 2.4rem;
  }

  .comment_item {
    .wrap_item {
      margin: 0 0 6.4rem;

      .wrap_header {
        @include flex;
        margin: 0 0 2.4rem;

        .wrap_left {
          @include flex;
          width: 90%;

          &:deep(.user-info) {
            &::after {
             content: "·";
              margin: 0 0.8rem;
              color: var(--text2);
              }
          }

          .wrap_reply_btn {
            margin: 0 0 0 3.2rem;
          }
        }

        .wrap_right {
          @include flex(column, $jc: center, $ai: end);
          flex-basis: 20%;
        }
      }

      .content {

        p {
          color: var(--text3);
          font-size: 1.4rem;
          white-space: pre;

          .lock_ico {
            margin: 0 0.8rem 0 0;
          }

          .receiver {
            font-weight: 500;
            color: var(--primary);
            border-radius: 3.2rem;
            margin: 0 0.8rem 0 0;
          }
        }
      }
    }
  }

  .not-is-acitve {
    margin: 0 0 0rem;
    font-size: 1.4rem;
    color: var(--text3);

    .content {
      margin: 0 0 6.4rem;
    }
  }

  .btn_childComment_toggle {
    margin: 2.4rem 0 0;
  }
</style>
