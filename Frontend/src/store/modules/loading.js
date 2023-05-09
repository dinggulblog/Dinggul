const state = () => ({
  isLoading: false,
  percentage: 0,
})

const mutations = {
  SET_LOADING(state, boolean) {
    state.isLoading = boolean
  },

  SET_PERCENTAGE(state, num) {
    state.percentage = num
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
