import { stringify } from 'querystring'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  post: {
    menu: {
      main: '',
      sub: '',
    },
    category: '',
    title: '',
    content: '',
    isPublic: true,
    isActive: true,
    images: [],
    thumbnail: '',
  },
  posts: [],
  editPosts: [],
  quickMove: false,
})

const getters = {}

const actions = {
  /**
   * Get post with Post ID
   * @param {Object} postId Post ID
   * @return {Object} { success, post, error }
   */
  async getPost({ commit }, { postId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')

      const { data } = await axios.get(`v1/posts/${postId}`)
      const { success, data: { post } } = data

      if (!post) {
        throw new Error('존재하지 않는 게시물입니다.')
      }

      commit('SET_POST', post)

      return { success, post, error: null }
    } catch (err) {
      return { success: false, post: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, skip, limit, category }
   * @return {Object} { success, error }
   */
  async getPosts({ rootState },{ main, sub, ...payload}) {
    try {
      if (main) {
        payload.menus = rootState.menu.menus[main].filter((menu) => !sub ? true : menu.sub === sub).map(({ _id }) => _id)
      }

      const { data } = await axios.get('v1/posts', { params: payload , paramsSerializer: (params) => stringify(params) })
      const { success, data: { posts, maxCount } } = data

      if (!success || !posts) {
        throw new Error('게시물을 받아오는데 실패하였습니다.')
      }

      return { success, posts, maxCount, error: null }
    } catch (err) {
      return { success: false, posts: [], maxCount: null, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Create a post with post object
   * @param {Object} Post { title, content, menu, ... }
   * @return {Object} { success, post, error }
   */
  async createPost({ rootState, state }, { payload }) {
    try {
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!state.post.menu.main || !state.post.menu.sub) {
        throw new Error('게시물을 삽입할 메뉴를 선택해 주세요.')
      }
      
      const { data } = await axios.post('v1/posts', payload)
      const { success, data: { post } } = data

      if (!success || !post) {
        throw new Error('게시물 작성에 실패하였습니다.')
      }

      return { success, post, error: null }
    } catch (err) {
      return { success: false, post: null, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Update a post with post object
   * @param {Object} Post { _id, title, content, menu, ... }
   * @return {Object} { success, post, images, error }
   */
  async updatePost({ rootState, state }, { payload }) {
    try {
      if (!state.post._id) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!rootState.auth.isAdmin || rootState.auth.user._id !== state.post.author._id) {
        throw new Error('본인이 작성한 게시물만 삭제 및 수정할 수 있습니다.')
      }
      if (!state.post.menu.main || !state.post.menu.sub) {
        throw new Error('게시물을 삽입할 메뉴를 선택해 주세요.')
      }

      const { data } = await axios.put(`v1/posts/${state.post._id}`, payload)
      const { success, data: { post, images } } = data

      if (!success) {
        throw new Error('게시물 업데이트에 실패하였습니다.')
      }

      return { success, post, images, error: null }
    } catch (err) {
      return { success: false, post: null, images: [], error: err?.response?.data?.message || err.message }
    }
  },

  async updatePosts({ rootState, commit }, payload) {
    try {
      if (!rootState.auth.isAdmin) {
        throw new Error('관리자 권한이 없습니다.')
      }

      const { data: { success } } = await axios.put('v1/posts', { posts: payload })

      if (!success) {
        throw new Error('게시물 업데이트에 실패하였습니다.')
      }

      commit('UNSET_EDIT_POSTS')

      return await actions.getPosts({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   * @return {Object} { success, error }
   */
  async updateLike({ rootState, state, commit }) {
    try {
      if (!state.post._id) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }

      const { data: { success } } = await axios.put(`v1/posts/${state.post._id}/like`)

      if (!success) {
        throw new Error('좋아요 요청에 실패하였습니다.')
      }

      commit('ADD_POST_LIKE')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Delete a post with post ID
   * @param {String} payload Post ID
   * @return {Object} { success, error }
   */
  async deletePost({ rootState, state, commit }) {
    try {
      if (!state.post._id) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!rootState.auth.isAdmin || rootState.auth.user._id !== state.post.author._id) {
        throw new Error('본인이 작성한 게시물만 삭제 및 수정할 수 있습니다.')
      }

      const { main, sub } = state.post.menu
      const { data: { success } } = await axios.delete(`v1/posts/${state.post._id}`)

      if (!success) {
        throw new Error('게시물 삭제에 실패하였습니다.')
      }

      commit('UNSET_POST')
      router.push({ name: 'posts', params: { main, sub } })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Delete a file from the post
   * @param {String} postId
   * @param {String} imageId
   * @return {Object} { success, error }
   */
  async deleteFile({ rootState, state, commit }, { imageId, index }) {
    try {
      if (!state.post._id) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!rootState.auth.isAdmin || rootState.auth.user._id !== state.post.author._id) {
        throw new Error('본인이 작성한 게시물만 삭제 및 수정할 수 있습니다.')
      }

      const { data: { success } } = await axios.delete(`v1/posts/${state.post._id}/file`, { data: { image: imageId } })

      if (!success) {
        throw new Error('파일 삭제에 실패하였습니다.')
      }

      commit('UNSET_IMAGE', index)

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Remove my ID from the like field of a post
   * @param {String} payload
   * @return {Object} { success, error }
   */
  async deleteLike({ rootState, state, commit }) {
    try {
      if (!state.post._id) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }

      const { data: { success } } = await axios.delete(`v1/posts/${state.post._id}/like`)

      if (!success) {
        throw new Error('좋아요 취소 요청에 실패하였습니다.')
      }

      commit('DELETE_POST_LIKE')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },
}

const mutations = {
  SET_POST(state, post) {
    state.post = post
  },

  SET_MAIN(state, main) {
    state.post.menu.main = main
  },

  SET_SUB(state, sub) {
    state.post.menu.sub = sub
  },

  SET_CATEGORY(state, category) {
    state.post.category = category
  },

  SET_TITLE(state, title) {
    state.post.title = title
  },

  SET_CONTENT(state, content) {
    state.post.content = content
  },

  SET_IS_PUBLIC(state, isPublic) {
    state.post.isPublic = isPublic
  },

  SET_IS_ACTIVE(state, isActive) {
    state.post.isActive = isActive
  },

  SET_IMAGES(state, images = []) {
    if (!Array.isArray(state.post.images)) return

    state.post.images.push(...images)
  },

  SET_THUMBNAIL(state, thumbnail) {
    state.post.thumbnail = thumbnail
  },

  SET_EDIT_POSTS(state, post) {
    state.editPosts.push(post)
  },

  SET_QUICKMOVE(state, boolean = false) {
    state.quickMove = boolean
  },

  ADD_POST_LIKE(state) {
    if (!state.post.liked) {
      state.post.liked = true
      state.post.likeCount = parseInt(state.post.likeCount, 10) + 1
    }
  },

  DELETE_POST_LIKE(state) {
    if (state.post.liked) {
      state.post.liked = false
      state.post.likeCount = parseInt(state.post.likeCount, 10) - 1
    }
  },

  UNSET_POST(state) {
    state.post = {
      menu: {
        main: '',
        sub: '',
      },
      category: '',
      title: '',
      content: '',
      isPublic: true,
      isActive: true,
      images: [],
      thumbnail: '',
    }
  },

  UNSET_IMAGE(state, index) {
    if (!Array.isArray(state.post.images)) return
    
    state.post.images.splice(index, 1)
  },

  UNSET_EDIT_POSTS(state) {
    state.editPosts = []
  },

  CHANGE_EDIT_POSTS(state) {
    state.editPosts.forEach((post) => {
      post.main = state.main
      post.sub = state.sub
      post.category = state.category
    })
  },

  ACTIVE_EDIT_POSTS(state, active) {
    state.editPosts.forEach((post) => {
      post.active = active
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
