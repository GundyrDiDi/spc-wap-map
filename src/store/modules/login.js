export default {
  namespaced: true,
  state: {
    username: 'username',
    password: 'password',
    isLogin: true,
    token: undefined
  },
  getters: {

  },
  mutations: {
    success (state) {
      state.isLogin = true
      state.token = (Math.random() * Math.pow(10, 17)).toString(16)
    }
  },
  actions: {
    async _submit (store) {
      const res = await axios.post('./getdata')
      if (res) {
        store.commit('success')
        return true
      }
    }
  },
  modules: {

  }
}
