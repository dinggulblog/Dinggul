import { setItem, getItem } from '../../common/sessionStorage.js'
import axios from '../../services/axios.js'

const state = () => ({
  type: 'list',
  category: '전체',
  categories: [],
  menus: getItem('menus', null),
  subMenus: [],
  curMenus: [],
  editMenus: [],
})

const getters = {}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get('v1/menus')
      const { success, data: { menus } } = data

      commit('SET_MENUS', menus)

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },

  async createMenu({ commit, state }, payload) {
    try {
      const { data } = await axios.post('v1/menus', payload)
      const { success, data: { menu } } = data

      if (!success) throw new Error('메뉴 생성에 실패하였습니다.')

      if(state.editMenus.length) commit('ADD_EDIT_MENUS', menu)

      return await actions.getMenus({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },

  async updateMenu({ commit }, { menuId, payload }) {
    try {
      const { data } = await axios.put(`v1/menus/${menuId}`, payload)
      const { success } = data

      if (!success) throw new Error('메뉴 업데이트에 실패하였습니다.')
      
      return await actions.getMenus({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },

  async deleteMenu({ commit }, { menuId }) {
    try {
      const { data } = await axios.delete(`v1/menus/${menuId}`)
      const { success } = data

      if (!success) throw new Error('메뉴 삭제에 실패하였습니다.')
      
      return await actions.getMenus({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },
}

const mutations = {
  SET_TYPE(state, type) {
    state.type = type
  },

  SET_CATEGORY(state, category) {
    state.category = category
  },

  SET_MENUS(state, menus = []) {
    state.menus = menus.reduce((acc, menu) => {
      const { main } = menu
      if (!acc[main]) acc[main] = []
      acc[main].push(menu)
      return acc
    }, {})
    setItem('menus', state.menus)
  },

  SET_CURRENT_MENUS(state, { main, sub }) {
    state.subMenus = state.menus[main]
    state.curMenus = state.subMenus

    if (sub) {
      state.curMenus = state.subMenus.filter((menu) => menu.sub === sub)
      state.type = state.curMenus[0].type
      state.categories = state.curMenus[0].categories
    }
    else {
      state.type = 'list'
      state.categories = [...new Set(state.subMenus.flatMap(({ categories }) => categories))]
    }
  },

  SET_EDIT_MENUS(state, menus) {
    state.editMenus = menus
  },

  ADD_EDIT_MENUS(state, menu) {
    state.editMenus.push(menu)
  },

  ADD_CATEGORY(state, category) {
    state.editMenus.categories.push(category)
  },

  DEL_CATEGORY(state, idx) {
    state.editMenus.categories.splice(idx, 1)
  }
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
