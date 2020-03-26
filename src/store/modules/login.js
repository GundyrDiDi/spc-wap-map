export default {
  name: 'login',
  namespaced: true,
  state: {
    username: '13914702847',
    password: '13914702847',
    isLogin: false,
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
    async submit (store) {
      const res = await axios.post('./getdata')
      if (res) {
        store.commit('success')
        return true
      }
    }
  }
}
