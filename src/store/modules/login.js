export default {
  namespaced: true,
  state: {
    username: 'username',
    password: 'password',
    isLogin: false
  },
  getters: {
    token () {
      return (Math.random() * Math.pow(10, 17)).toString(16)
    }
  },
  mutations: {
    success (state) {
      state.isLogin = true
    }
  },
  actions: {
    async _submit (store) {
      const res = await axios.post('/login', store.state)
      console.log(res)
      if (res.data) {
        store.commit('success')
        return true
      } else {
        return false
      }
    }
  },
  modules: {

  }
}
