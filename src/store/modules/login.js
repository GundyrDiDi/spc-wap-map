export default {
  name: 'login',
  namespaced: true,
  state: {
    username: 'szl',
    password: 'szl',
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
