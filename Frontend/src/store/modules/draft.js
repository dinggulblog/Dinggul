import axios from '../../services/axios'

const state = () => ({
  draft: {},
})

const getters = {}

const actions = {
  async getDraft({ commit }, { draftId }) {
    try {
      if (!draftId) throw new Error('게시물을 찾을 수 없습니다.')

      const { data } = await axios.get(`v1/drafts/${draftId}`)
      const { success, data: { draft } } = data

      if (!draft) {
        throw new Error('존재하지 않는 게시물입니다.')
      }

      commit('SET_DRAFT', draft)
      
      return { success, draft, error: null }
    } catch (err) {
      return { success: false, draft: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  async createDraft({ rootState, commit }, { payload }) {
    try {
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!rootState.post.post.menu.main || !rootState.post.post.menu.sub) {
        throw new Error('게시물을 삽입할 메뉴를 선택해 주세요.')
      }

      const { data } = await axios.post('v1/drafts', payload)
      const { success, data: { draft, images } } = data

      if (!success || !draft) {
        throw new Error('게시물 작성에 실패하였습니다.')
      }

      commit('SET_DRAFT', draft)

      return { success, draft, images, error: null }
    } catch (err) {
      return { success: false, draft: null, images: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  // params: Object (draft)
  async updateDraft({ rootState, commit }, { draftId, payload }) {
    try {
      if (!draftId) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }
      if (!rootState.post.post.menu.main || !rootState.post.post.menu.sub) {
        throw new Error('게시물을 삽입할 메뉴를 선택해 주세요.')
      }

      const { data } = await axios.put(`v1/drafts/${draftId}`, payload)
      const { success, data: { draft, images } } = data

      commit('SET_DRAFT', draft)

      return { success, draft, images, error: null }
    } catch (err) {
      return { success: false, draft: null, images: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  // params: String (draft ID)
  async deleteDraft({ rootState, commit }, { draftId }) {
    try {
      if (!draftId) {
        throw new Error('존재하지 않는 게시물입니다.')
      }
      if (!rootState.auth.user) {
        throw new Error('로그인 후 사용 가능합니다.')
      }

      const { data: { success } } = await axios.delete(`v1/drafts/${draftId}`)

      commit('UNSET_DRAFT')
      
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },

  async deleteFile({ commit }, { draftId, imageId, index }) {
    try {
      const { data: { success } } = await axios.delete(`v1/drafts/${draftId}/file`, { data: { image: imageId } })

      if (!success) {
        throw new Error('파일 삭제에 실패하였습니다.')
      }

      commit('post/UNSET_IMAGE', index, { root: true })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: '파일 삭제를 실패하였습니다.' }
    }
  },
}

const mutations = {
  SET_DRAFT(state, draft) {
    state.draft = draft
  },

  UNSET_DRAFT(state) {
    state.draft = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
