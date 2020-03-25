export default {
  name: 'login',
  namespaced: true,
  state: {
    username: '13914702847',
    password: '13914702847',
    isLogin: false
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    async submit (store, payload) {
      console.log(store)
      console.log(payload)
      console.log(store.state)
      console.log(axios)
    }
  }
}
