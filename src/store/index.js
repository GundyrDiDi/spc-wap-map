import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
import menu from './modules/menu'
import commitDrt from './plugins/commit'

Vue.use(Vuex)
const root = {
  // everyStore中命名modules
  name: '',
  state: {
    // 过渡
    isloading: false,
    enterTime: 2000,
    enterAnimateTime: 1300,
    enterclass: '',
    leaveclass: '',
    // 容器
    deviceHeight: '',
    deviceWidth: '',
    bannerHeight: 45,
    bottomHeight: 50,
    truestateBar: 10,
    btnopacity: 1,
    rightdrawer: false,
    rtlDrawer: false,
    _records: [],
    searchWord: '',
    resultList: [],
    historyList: JSON.parse(window.localStorage.spc_history ? window.localStorage.spc_history : '[]'),
    proxyLocation: null,
    dyIcons: {
      arrow: [
        require('../assets/funimg/ta02.png'),
        require('../assets/funimg/ta01.png')
      ]
    }
  },
  getters: {
    stateBar (state) {
      return state.truestateBar + 6
    },
    vpHeight (state, getters) {
      return state.deviceHeight - getters.stateBar
    },
    topHeight (state) {
      return state.deviceWidth * 9 / 16
    }
  },
  mutations: {
    _clearHistory (state) {
      state.historyList = []
      window.localStorage.spc_history = JSON.stringify(state.historyList)
    },
    _setStorage (state, data) {
      const history = state.historyList
      history.some(v => v.name === data.name) || history.push(data)
      window.localStorage.spc_history = JSON.stringify(history)
    }
  },
  actions: {
    _commit (store, { type, value }) {
      store.commit(type, value)
    },
    _nameclass (store, [enter, leave]) {
      store.commit('enterclass', enter)
      store.commit('leaveclass', leave)
    },
    _record (store, { type, value, replace }) {
      const state = store.state
      let oldValue = state
      type.split('/').forEach(prop => {
        oldValue = oldValue[prop]
      })
      if (oldValue !== value) {
        if (replace) {
          const last = state._records[state._records.length - 1]
          if ((!last) || last[0] !== type) {
            state._records.push([type, oldValue])
          }
        } else {
          state._records.push([type, oldValue])
        }
        store.commit(type, value)
      }
    },
    _goback (store) {
      const records = store.state._records
      if (records.length) {
        return store.commit(...records.pop())
      }
    },
    // _manualback(store){
    //   const records = store.state._records
    //   if (records.length) {
    //     records.pop();
    //   }
    // }
    async _search (store, sw) {
      store.commit('resultList', await axios.post('/search', { word: sw }))
    },
    async _moresearch (store, sw) {
      store.state.resultList.push(...await axios.post('/search', { word: sw }))
    },
    async _leastTime (store, { promise, time = 1000 } = {}) {
      const output = await Promise.all([
        new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, time)
        }),
        promise
      ]).then(arr => arr[1])
      return output
    }
  },
  modules: {
    login,
    map,
    menu
  },
  plugins: [
    commitDrt
  ]
}
const modules = everyStore(root)
// 每一个module里的state数据通过mutations改变
modules.forEach(bindMutations)

export const store = new Vuex.Store(root)

export const vuexData = {
  ...mapVuex(modules)
}
// util
function everyStore (root) {
  const stores = [root]; let i = 0
  while (i < stores.length) {
    const s = stores[i]
    if (s.modules) {
      Object.entries(s.modules).forEach(([prop, store]) => {
        store.name = s === root ? prop : `${s.name}_${prop}`
        stores.push(store)
      })
    }
    i++
  }
  return stores
}
function mapVuex (modules) {
  const map = {
    computed: ['state', 'getters'],
    methods: ['mutations', 'actions']
  }
  const vuexData = {
    computed: {},
    methods: {}
  }
  modules.forEach(module => {
    Object.entries(map).forEach(([prop, arr]) => {
      arr.forEach(str => {
        if (module[str]) {
          vuexData[prop] = {
            ...mapkeys(str, module),
            ...vuexData[prop]
          }
        }
      })
    })
  })
  return vuexData
}
function mapkeys (str, module = root) {
  if (!module[str]) return {}
  let fn = Vuex['map' + str.slice(0, 1).toUpperCase() + str.slice(1)]
  let keys = Object.keys(module[str])
  if (module.name) {
    fn = fn.bind(Vuex, module.name.replace('_', '/'))
  }
  if (str === 'mutations' || str === 'actions') {
    keys = keys.reduce((acc, key) => {
      if (key.includes('_')) {
        acc[module.name + key] = key
      }
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}
function bindMutations (module) {
  module.mutations = {
    ...module.mutations,
    ...new Proxy(module.state, {
      get (target, propKey) {
        return (state, payload) => {
          state[propKey] = payload
        }
      },
      // 过滤 前缀_表示内部数据
      ownKeys (target) {
        return Object.keys(target).filter(key => key[0] !== '_')
      }
    })
  }
}
