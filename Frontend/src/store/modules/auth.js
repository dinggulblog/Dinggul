import { setItem, getItem, clearStorage } from '../../common/localStorage'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  user: getItem('user', null),
  isAdmin: getItem('isAdmin', false),
  isValidAdmin: false,
  members: [],
  editMembers: [],
})

const getters = {}

const actions = {
  async login({ commit }, payload) {
    try {
      const { data: { success } } = await axios.post('v1/auth', payload)

      if (!success) throw new Error('로그인에 실패하였습니다.')

      return await actions.getAccount({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  async refresh({ commit }) {
    try {
      const { data: { success } } = await axios.put('v1/auth')

      if (!success) throw new Error('로그인 갱신에 실패하였습니다.')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  async logout({ commit }) {
    try {
      const { data: { success } } = await axios.delete('v1/auth')
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    } finally {
      commit('UNSET_USER')
      router.currentRoute.value.meta.requiredAuth ? router.push({ name: 'home' }) : router.go(0)
    }
  },

  async createAccount({ commit }, payload) {
    try {
      const { data: { success } } = await axios.post('v1/users/account', payload)

      if (!success) throw new Error('계정 생성에 실패하였습니다.')

      return await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async getAccount({ commit }) {
    try {
      const { data } = await axios.get('v1/users/account')
      const { success, data: { user } } = data

      if (!success || !user) throw new Error('계정 정보를 받아오는 도중 에러가 발생하였습니다.\n다시 로그인 해 주세요.')

      commit('SET_USER', user)

      return { success, user, error: null }
    } catch (err) {
      commit('UNSET_USER')
      return { success: false, user: null, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateAccount({ commit }, payload) {
    try {
      const { data: { success } } = await axios.put('v1/users/account', payload)

      if (!success) throw new Error('계정 업데이트에 실패하였습니다.')

      return await actions.getAccount({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async deleteAccount({ commit }) {
    try {
      const { data: { success } } = await axios.delete('v1/users/account')

      if (!success) throw new Error('계정 삭제에 실패하였습니다.')

      alert('계정 삭제가 진행됩니다.\n계정 및 계정과 관련된 데이터는 14일 후에 완전히 사라집니다.')

      await actions.logout({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async getProfile({ commit }, { nickname }) {
    try {
      const { data } = await axios.get(`v1/users/profile/${nickname}`)
      const { success, data: { profile } } = data

      if (!success || !profile) {
        throw new Error('프로필을 받아오는 도중 에러가 발생하였습니다.')
      }

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateProfile({ state }, { nickname, payload }) {
    try {
      if (nickname !== state.user?.nickname) {
        throw new Error('본인 프로필만 수정 가능합니다.')
      }

      const { data } = await axios.put(`v1/users/profile/${nickname}`, payload)
      const { success, data: { profile } } = data

      if (!success || !profile) {
        throw new Error('프로필 업데이트에 실패하였습니다.')
      }

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateProfileAvatar({ state, commit }, { nickname, payload }) {
    try {
      if (nickname !== state.user?.nickname) {
        throw new Error('본인 프로필만 수정 가능합니다.')
      }

      const { data } = await axios.put(`v1/users/profile/${nickname}/avatar`, payload)
      const { success, data: { profile } } = data

      if (!success || !profile?.avatar) {
        throw new Error('프로필 아바타 업로드를 실패하였습니다.')
      }

      commit('SET_USER_AVATAR', profile.avatar)

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async deleteProfileAvatar({ state, commit }, { nickname }) {
    try {
      if (nickname !== state.user?.nickname) {
        throw new Error('본인 프로필만 수정 가능합니다.')
      }

      const { data: { success } } = await axios.delete(`v1/users/profile/${nickname}/avatar`)

      if (!success) {
        throw new Error('프로필 아바타 삭제에 실패하였습니다.')
      }

      commit('SET_USER_AVATAR', '')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async createResetLink({ commit }, { email }) {
    try {
      const { data } = await axios.post(`v1/users/account/reset/${email}`)
      const { success } = data

      if (!success) throw new Error('해당 이메일이 존재하지 않습니다.')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updatePassword({ commit }, payload) {
    try {
      const { data } = await axios.put(`v1/users/account/reset`, payload)
      const { success } = data

      if (!success) throw new Error('비밀번호 재설정 링크가 만료되었습니다.')
      
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async getMembers({ commit }) {
    try {
      const { data } = await axios.get('v1/users/accounts')
      const { success, data: { users } } = data

      if (!success || !users) throw new Error('멤버 정보를 받아오는 도중 에러가 발생하였습니다')

      commit('SET_MEMBERS', users)

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateMembers({ commit }, payload) {
    try {
      const { data: { success } } = await axios.put('v1/users/accounts', { users: payload })

      if (!success) throw new Error('계정 업데이트에 실패하였습니다.')

      commit('UNSET_EDIT_MEMBERS')

      return await actions.getMembers({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },
}

const mutations = {
  SET_USER(state, { roles, ...user }) {
    state.user = user
    state.isAdmin = roles && roles.includes('ADMIN')
    setItem('user', state.user)
    setItem('isAdmin', state.isAdmin)
  },

  SET_USER_AVATAR(state, avatar) {
    if (state.user) {
      state.user.avatar = avatar
      setItem('user', state.user)
    }
  },

  UNSET_USER(state) {
    state.user = null
    state.isAdmin = false
    state.isValidAdmin = false
    clearStorage()
  },

  SET_ADMIN(state) {
    state.isValidAdmin = true
  },

  SET_MEMBERS(state, members) {
    state.members = members
  },

  SET_EDIT_MEMBERS(state, members) {
    state.editMembers.push(members)
  },

  EDIT_MEMBERS_ACTIVE(state, active) {
    state.editMembers.forEach((member) => {
      member.isActive = active
    })
  },

  UNSET_EDIT_MEMBERS(state) {
    state.editMembers = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
