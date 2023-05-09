import { searchParentComment } from '../../common/util.js' 
import axios from '../../services/axios'

const state = () => ({
  comment: {
    content: '',
    isPublic: true
  },
  comments: [],
  commentCount: 0,
})

const getters = {
  getParentComment: (state) => (parentId) => {
    return state.comments.find(comment => searchParentComment(comment, parentId))
  }
}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, { postId }) {
    try {
      const { data } = await axios.get(`v1/comments/${postId}`)
      const { success, data: { comments, commentCount } } = data
      
      commit('SET_COMMENTS', { comments, commentCount })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object
  async createComment({ commit }, { postId, ...payload }) {
    try {
      const { data: { success } } = await axios.post(`v1/comments/${postId}`, payload)

      if (!success) throw new Error('댓글을 다는 도중 에러가 발생하였습니다.')

      commit('UNSET_COMMENT', payload.parentId)
      
      return await actions.getComments({ commit }, { postId })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object
  async updateComment({ rootState, commit }, { postId, commentId, ...payload }) {
    try {
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data: { success } } = await axios.put(`v1/comments/${postId}/${commentId}`, payload)

      if (!success) throw new Error('댓글을 다는 도중 에러가 발생하였습니다.')

      commit('UNSET_COMMENT', commentId)

      return await actions.getComments({ commit }, { postId })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ rootState, commit }, { commentId, postId, isOwner }) {
    try {
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')
      if (!isOwner) throw new Error('본인 댓글만 삭제가 가능합니다.')

      const { data: { success } } = await axios.delete(`v1/comments/${postId}/${commentId}`)

      if (!success) throw new Error('댓글을 다는 도중 에러가 발생하였습니다.')

      commit('UNSET_COMMENT', commentId)

      return await actions.getComments({ commit }, { postId })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },
}

const mutations = {
  SET_CONTENT(state, { id, content }) {
    state[id].content = content
  },

  SET_IS_PUBLIC(state, { id, isPublic }) {
    state[id].isPublic = isPublic
  },

  SET_COMMENT(state, { update, comment }) {
    state[comment._id] = update ? { ...comment } : { content: '', isPublic: true }
  },

  SET_COMMENTS(state, { comments = [], commentCount = 0 }) {
    state.comments = comments
    state.commentCount = commentCount
  },

  UNSET_COMMENT(state, id = 'comment') {
    state[id] = {
      content: '',
      isPublic: true
    }
  },

  UNSET_COMMENTS(state) {
    state.comments = []
    state.commentCount - 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
