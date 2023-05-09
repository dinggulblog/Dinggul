<template>
  <div class="commentEditor" @mousedown="!$store.state.auth.user && ACCOUNT_EL.open('login')">

    <textarea
      ref="CONTENT_EL"
      rows="1"
      v-model="content"
      :disabled="!$store.state.auth.user"
      :placeholder="!$store.state.auth.user ? '로그인 후 댓글을 작성해보세요.' : placeholderText"
      @blur="!$store.state.auth.user ? '로그인 후 댓글을 작성해보세요.' : placeholderText"
      @input="resizeTextarea"
    />

    <div class="wrap_btns">
      <div class="wrap_toggle">
        <Toggle :isPublic="isPublic" @update="onUpdatedIsPublic" />
      </div>
      <div class="wrap_submit">
        <div class="submit">
          <Button 
            class="btn_submit"
            :shape="'fill-round'"
            :theme="'primary'"
            @click="commentId ? onUpdateComment() : onCreateComment()">
            {{ commentId ? '댓글 수정' : '댓글 작성' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject, ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { resizeTextarea } from '../common/util.js'
  import Toggle from './ui/Toggle.vue'

  const props = defineProps({
    id: {
      type: String,
      default: 'comment'
    },
    postId: {
      type: String,
      reqired: true,
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    placeholderText: {
      type: String,
      default: '댓글을 작성해보세요.',
    },
  })

  const emits = defineEmits(['closeEditor'])

  const { state, dispatch, commit } = useStore()

  const CONTENT_EL = ref(null)
  const ACCOUNT_EL = inject('ACCOUNT_EL')
  const TOAST_EL = inject('TOAST_EL')

  const commentId = computed({
    get: () => state.comment[props.id]._id
  })
  const isPublic = computed({
    get: () => state.comment[props.id].isPublic,
    set: (value) => commit('comment/SET_IS_PUBLIC', { id: props.id, isPublic: value })
  })
  const content = computed({
    get: () => state.comment[props.id].content,
    set: (value) => commit('comment/SET_CONTENT', { id: props.id, content: value })
  })

  const onUpdatedIsPublic = (state) => {
    isPublic.value = state
  }

  const onCreateComment = async () => {
    const { success, error } = await dispatch('comment/createComment', {
      parentId: props.id !== 'comment' ? props.id : undefined,
      postId: props.postId,
      content: content.value,
      isPublic: isPublic.value
    })

    if (!success) return TOAST_EL.value.open('error', error)

    emits('closeEditor')
    CONTENT_EL.value.style.height = ''
  }

  const onUpdateComment = async () => {
    const { success, error } = await dispatch('comment/updateComment', {
      commentId: commentId.value,
      postId: props.postId,
      content: content.value,
      isPublic: isPublic.value,
    })

    if (!success) return TOAST_EL.value.open('error', error)

    emits('closeEditor')
    CONTENT_EL.value.style.height = ''
  }

  onMounted(() => {
    if(props.id === 'comment') return
    CONTENT_EL.value.focus()
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .commentEditor {
    margin: 2.4rem 0 0 0;
    border: 1px solid var(--border2);
    border-radius: 0.8rem;
    padding: 2rem;

    textarea {
      color: var(--text4);
      font-size: 1.4rem;
      margin: 0 0 1.6rem;
      resize: none;
      overflow-y: hidden;
      width:100%;
      height: 4.8rem;

      @include placeholder(text2);

      &:disabled {
        background-color: transparent;
      }
    }

    .wrap_btns {
      @include flex-right;

      .wrap_toggle {
        flex-basis: 50%;

        .toggle {
          @include flex;
          user-select: none;
          cursor: pointer;

          span {
            margin: 0 0 0 0.8rem;
            font-size: 1.2rem;
            font-weight: 500;
            letter-spacing: 0.1rem;
          }
        }
      }

      .wrap_submit {
        @include flex-right;
        flex-basis: 50%;
      }
    }
  }
</style>
