<template>
  <div class="editor">
    <div class="wrap_select_toggle">
      <div class="select">
        <!-- Main menu select box -->
        <div class="main">
          <select required v-model="main" @change="onChangeMainMenu">
            <option disabled hidden :value="''">메뉴 선택</option>
            <option v-for="main_menu in Object.keys($store.state.menu.menus)" :key="main_menu" :value="main_menu">{{ main_menu }}</option>
          </select>
        </div>

        <!-- Sub menu select box -->
        <div class="sub">
          <select required v-model="sub" :disabled="!main" @change="onChangeSubMenu">
            <option disabled hidden :value="''">게시판 선택</option>
            <option v-for="sub_menu in $store.state.menu.menus[main]" :key="sub_menu.sub" :value="sub_menu.sub">{{ sub_menu.sub }}</option>
          </select>
        </div>

        <!-- Category select box -->
        <div class="category">
          <select v-model="category" :disabled="!sub">
            <option disabled hidden :value="''">카테고리 선택</option>
            <template v-if="sub">
              <option v-for="category_menu in $store.state.menu.categories" :key="category_menu" :value="category_menu">{{ category_menu }}</option>
            </template>
          </select>
        </div>
      </div>

      <!-- Public scope toggle button -->
      <div class="wrap_toggle">
        <Toggle :isPublic="isPublic" @update="onChangeIsPublic" />
      </div>
    </div>

    <!-- Title and File button -->
    <div class="wrap_title">
      <div class="title">
        <input type="text" v-model="title" placeholder="제목을 입력하세요." onfocus="this.placeholder=''" onblur="this.placeholder='제목을 입력하세요.'" />
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <MdEditor
        ref="CONTENT_EL"
        v-model="content"
        language="ko-KR"
        placeholder="당신의 이야기를 적어보세요..."
        :toolbars="toolbars"
        :preview="!isMobile"
        @keydown="onChangeCanLeavePage(false)"
      >
        <template #defToolbars>
          <EmojiExtension @insert="onInsertEmoji" />
        </template>
      </MdEditor>
    </div>

    <!-- GPT Buttons -->
    <div class="wrap_gpt_btns">
      <Button :size="'sm'" :shape="'line-round'" @click="onCreateCompletions" aria-label="GPT CREATE START">GPT 초안 생성</Button>
      <Button :size="'sm'" :shape="'line-round'" @click="onCloseCompletions" aria-label="GPT CREATE STOP">GPT 초안 정지</Button>
    </div>

    <!-- Image Buttons -->
    <div class="wrap_image_btns">
      <div class="images_add_btn">
        <label for="upload_input" class="upload_label"> <Ico :svg="'add-image'" class="ico_add-image" />사진 추가</label>
        <input ref="UPLOAD_INPUT_EL" type="file" id="upload_input" @change="onUploadImages" @click="$refs.UPLOAD_INPUT_EL.value = ''" multiple />
      </div>
      <!--
        <Button
          v-show="fileState.files.length"
          class="btn_image_clear"
          svg="add-image"
          :content="'사진 모두 제거'"
          :size="'md'"
          @click="onClearImages"
        ></Button>
        -->
    </div>

    <!-- Images -->
    <div class="images" v-if="images.length">
      <ul>
        <li v-for="(file, index) in images" :key="index">
          <div class="wrap_thumbnail">
            <Image
              :src="`${file.thumbnail}`"
              :class="file.thumbnail === thumbnail ? 'selected_thumbnail' : ''"
              :filename="file.serverFileName"
              @click="onSelectImage(file), onInsertImage(file.thumbnail)"
            />
            <Button class="image_del_btn" 
              aria-label="DELETE IMAGE"
              :svg="'del-image'" 
              :theme="'primary'"
              @click="onDeleteImage(file._id, index)"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- Submit Button -->
    <div class="wrap_btns">
      <Button 
        class="btn_submit"
        :shape="isMobile ? 'fill-round-full' : 'fill-round'"
        :theme="'primary'"
        @click="onChangeCanLeavePage(true), onUpdatePost()"
      >작성 완료
      </Button>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, reactive, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import Toggle from '../../components/ui/Toggle.vue'
import MdEditor from 'md-editor-v3'
import EmojiExtension from '../../components/EmojiExtension.vue'
import { toolbars } from '../../common/editor/toolbars.js'
import { ko_KR } from '../../common/editor/ko_KR.js'
import 'md-editor-v3/lib/style.css'

MdEditor.config({
  editorConfig: {
    languageUserDefined: {
      'ko-KR': ko_KR,
    },
  },
})

const route = useRoute()
const { push } = useRouter()
const { state, dispatch, commit } = useStore()

const isMobile = inject('isMobile')
const DIALOG_EL = inject('DIALOG_EL')
const TOAST_EL = inject('TOAST_EL')
const CONTENT_EL = ref(null)

const MAX_TRY = 3
let tempId = null
let autoSave = null
let eventSource = null
let canLeavePage = true

const main = computed({
  get: () => state.post.post.menu?.main ?? '',
  set: (value) => commit('post/SET_MAIN', value)
})
const sub = computed({
  get: () => state.post.post.menu?.sub ?? '',
  set: (value) => commit('post/SET_SUB', value)
})
const category = computed({
  get: () => state.post.post.category ?? '',
  set: (value) => commit('post/SET_CATEGORY', value)
})
const title = computed({
  get: () => state.post.post.title ?? '',
  set: (value) => commit('post/SET_TITLE', value)
})
const content = computed({
  get: () => state.post.post.content ?? '',
  set: (value) => commit('post/SET_CONTENT', value)
})
const isPublic = computed({
  get: () => state.post.post.isPublic,
  set: (value) => commit('post/SET_IS_PUBLIC', value)
})
const images = computed({
  get: () => state.post.post.images ?? [],
  set: (value) => commit('post/SET_IMAGES', value)
})
const thumbnail = computed({
  get: () => state.post.post.thumbnail ?? '',
  set: (value) => commit('post/SET_THUMBNAIL', value)
})

const postState = reactive({
  main,
  sub,
  title,
  content,
  category,
  isPublic,
  images: computed(() => images.value.length > 0 ? images.value.map((image) => image._id) : []),
  thumbnail
})

const onChangeMainMenu = () => {
  document.body.querySelector('div.sub select').selectedIndex = 0
  document.body.querySelector('div.category select').selectedIndex = 0
}

const onChangeSubMenu = () => {
  document.body.querySelector('div.category select').selectedIndex = 0
}

const onChangeIsPublic = (state) => {
  isPublic.value = Boolean(state)
}

const onUpdateDraft = async ({ payload }) => {
  if (!tempId) {
    const { success, draft, error } = await dispatch('draft/createDraft', { payload: postState })
    if (!success) return { success, images: [], error }

    tempId = draft._id
  }

  const { success, images: updatedImages, error } = await dispatch('draft/updateDraft', { draftId: tempId, payload: payload ? payload : postState })
  if (success) TOAST_EL.value.open('success', '임시저장 되었습니다.')

  return { success, images: updatedImages, error }
}

const onUpdatePost = async () => {
  const { success, post, error } = route.query.postId
    ? await dispatch('post/updatePost', { payload: postState })
    : await dispatch('post/createPost', { payload: postState })

  if (!success) return TOAST_EL.value.open('error', error)

  push({ name: 'post', params: { postId: post._id } })
}

const onUploadImages = async (event) => {
  if (!event.target.files.length) return

  const formData = new FormData()
  Object.values(event.target.files).forEach((file) => formData.append('images', file, file.name.replace(/(\s)/g, '')))
  Object.entries(postState).forEach(([key, value]) => formData.append(key, value))

  const { success, images: updatedImages, error } = route.query.postId
    ? await dispatch('post/updatePost', { payload: formData })
    : await onUpdateDraft({ payload: formData })

  if (!success) return TOAST_EL.value.open('error', error)

  if (Array.isArray(updatedImages) && updatedImages.length) {
    images.value = updatedImages
    onSelectImage(updatedImages[0])

    for await (const image of updatedImages) {
      nextTick()
      onInsertImage(image.thumbnail)
    }
  }
}

const onDeleteImage = async (fileId, index) => {
  const { success, error } = route.query.postId
    ? await dispatch('post/deleteFile', { imageId: fileId, index })
    : await dispatch('draft/deleteFile', { imageId: fileId, index, draftId: tempId })

  if (!success) return TOAST_EL.value.open('error', error)
}

const onSelectImage = (file) => {
  thumbnail.value = file?.thumbnail
}

const onInsertImage = (url) => {
  const textarea = document.querySelector('#md-editor-v3-textarea')
  let start = textarea.value.substring(0, textarea.selectionStart)
  let end = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

  const innerText = `\n!` + `[` + `]` + `(` + `${url}` + `)\n`
  content.value = start + innerText + end
  textarea.focus()
}

const onCreateCompletions = async () => {
  const url = `//localhost:3000/v1/openai/stream/completions?prompt=${title.value}`

  if (eventSource && (eventSource.readyState === 0 || eventSource.readyState === 1)) {
    return TOAST_EL.value.open('error', '초안 생성 중입니다. 생성 종료 버튼을 눌러 진행을 멈추거나 생성이 종료된 후 다시 시도해 주세요.')
  }
  if (title.value.length < 6) {
    return TOAST_EL.value.open('error', '제목을 최소 5글자 이상 입력해주세요.')
  }

  eventSource = new EventSource(url, { withCredentials: true })

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    content.value += data
  }
  eventSource.onerror = (error) => {
    error.data === 'DONE'
      ? TOAST_EL.value.open('success', '초안 작성을 완료하였습니다.')
      : TOAST_EL.value.open('error', '서버와 통신이 원할하지 않습니다. 잠시 후 다시 시도해 주세요.')

    eventSource.close()
  }
}

const onCloseCompletions = () => {
  eventSource.close()
}

const onChangeCanLeavePage = (bool) => {
  canLeavePage = bool
}

const onInsertEmoji = (generator) => {
  CONTENT_EL.value?.insert(generator)
}

const unloadEvent = (event) => {
  if (!canLeavePage) {
    event.preventDefault()
    event.returnValue = ''
  }
}

watch(
  () => canLeavePage,
  (newCanLeavePage, oldCanLeavePage) => {
    if (newCanLeavePage && !oldCanLeavePage && !autoSave) {
      autoSave = route.query.postId ? setInterval(onUpdatePost, 1000 * 60 * 5) : setInterval(onUpdateDraft, 1000 * 60 * 5)
    }
  },
)

watch(
  sub,
  () => {
    if (main.value) {
      commit('menu/SET_CURRENT_MENUS', { main: main.value, sub: sub.value })
    } 
  },
  { immediate: true }
)

watch(
  () => route.query,
  async () => {
    if (route.query.postId && route.query.postId !== state.post.post._id) {
      const { success, error } = await dispatch('post/getPost', { postId: route.query.postId })

      if (!success) {
        TOAST_EL.value.open('error', error)
        return push({ name: 'editor' })
      }
    }

    else if (route.query.draftId) {
      const { success, error } = await dispatch('post/getDraft', { draftId: route.query.draftId })

      if (!success) {
        TOAST_EL.value.open('error', error)
        return push({ name: 'editor' })
      }

      tempId = route.query.draftId
    }

    else if (!route.fullPath.includes('?')){
      commit('post/UNSET_POST')
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('beforeunload', unloadEvent)
  onSelectImage(images.value[0])
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', unloadEvent)
  clearInterval(autoSave)
})

onBeforeRouteLeave(async (to, from, next) => {
  if (canLeavePage) next()
  else {
    const ok = await DIALOG_EL.value.show({
      title: '현재 페이지에서 나가시겠습니까?',
      message: '임시 저장되지 않은 내용은 사라질 수 있습니다.',
      okButton: '나가기',
      cancelButton: '잠시만요!',
    })
    ok ? next() : next(false)
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.editor {
  .wrap_select_toggle {
    @include flex;

    @include mobile {
      @include flex(column, $ai: end);
    }

    .select {
      @include flex;
      width: 90%;

      @include mobile {
        @include flex(column);
        width: 100%;
      }

      div {
        @include flex-center;
        border-bottom: 1px solid var(--border3);
        width: 27rem;
        font-size: 1.4rem;
        margin-right: 2.4rem;

        @include mobile {
          width: 100%;
          margin-right: 0;
          margin-bottom: 1.6rem;
        }

        select {
          width: 100%;
          font-size: 1.4rem;
          color: var(--text3);
          height: 4.8rem;
          background-color: transparent;
          text-transform: uppercase;
        }

        &:last-child select > option {
          text-transform: none;
        }
      }
    }

    .wrap_toggle {
      @include flex-right;
      width: 10%;

      &:deep(.toggle) {
        flex-direction: row-reverse;

        span {
          margin: 0 0.4rem 0 0;
        }
      }

      @include mobile {
        width: 100%;
      }
    }
  }

  .wrap_title {
    @include flex;
    border-bottom: 1px solid var(--border3);
    margin: 2.4rem 0 1.6rem;
    width: 100%;
    height: 4.8rem;

    @include mobile {
      margin: 1.6rem 0;
    }

    .title {
      width: 80%;

      input {
        color: var(--text4);
        font-size: 1.4rem;
        width: 100%;
      }

      input::placeholder {
        color: var(--text2);
        font-size: 1.4rem;
      }
    }
  }

  .wrap_gpt_btns {
    @include flex;
    margin: 2.4rem 0 0;
    
    button {
      margin:0 0.8rem 0 0;
    }
  }

  .images_add_btn {
    margin: 1.6rem 0 2.4rem;
    label.upload_label {
      @include flex;
      font-size: 1.2rem;
      line-height: 1.8rem;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      color: var(--text3);
      padding: 1.2rem 2.4rem 1.2rem 0;

      .ico_add-image {
        margin: 0 0.8rem 0 0;
      }
    }

    input#upload_input {
      display: none;
    }
  }

  .btn_image_clear {
    margin: 0 0 0 0;
  }

  .images {
    margin: 0 0 2.4rem 0;
    ul {
      @include flex;
      flex-wrap: wrap;
      margin: calc(3.2rem - 1.2rem) 0 0;

      li {
        width: 7.4rem;
        height: calc(7.4rem + 1.6rem);
        margin: 0rem 2.4rem 0 0;

        .wrap_thumbnail {
          @include position;

          img {
            width: 100%;
            height: 7.4rem;
            border-radius: 2.4rem;
            object-fit: cover;
            padding: 0.2rem;

            &.selected_thumbnail {
              border: 2px solid var(--primary);
            }
          }
          .image_del_btn {
            @include position(absolute, $b: -0.6rem, $r: -0.6rem);
            color: var(--primary);

            i {
              font-size: 2.2rem;
            }

            .material-symbols-outlined {
              font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
          }
        }
      }
    }
  }

  .wrap_btns {
    @include flex(column, $ai:end);
  }
}


.md-editor, .md-editor-toolbar-wrapper {
  border:0 !important;
}



</style>
