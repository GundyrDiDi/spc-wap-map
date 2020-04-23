export default {
  namespaced: true,
  state: {
    menus: [
      { name: '地图', route: '' },
      { name: '应用', route: 'apply' },
      { name: '我的', route: 'user' }
    ],
    menuIndex: 0,
    totop: false,
    tofocus: false,
    toexpend: false
  },
  getters: {
    activeMenu (state) {
      return state.menus[state.menuIndex]
    }
  },
  mutations: {

  },
  actions: {

  }
}
