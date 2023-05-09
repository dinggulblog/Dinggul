import axios from '../../services/axios'

const state = () => ({
  text: ''
})

const getters = {}

const actions = {
  async createCompletions({ commit, state }, payload) {
    try {
      const { data } = await axios.post('v1/openai/stream/completions', payload)
      return { success: true, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },
}

const mutations = {
  SET_TEXT(state, text) {
    state.text += text
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
