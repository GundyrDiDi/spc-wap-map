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
    isloading: false,
    enterclass: '',
    leaveclass: '',
    deviceHeight: '',
    deviceWidth: '',
    bottomHeight: 50,
    stateBar: 6,
    btnopacity: 1,
    rightdrawer: false,
    _records: [],
    rtlDrawer: false,
    searchWord: '',
    resultList: [],
    historyList: JSON.parse(window.localStorage.spc_history ? window.localStorage.spc_history : '[]')

  },
  getters: {
    vpHeight (state) {
      return state.deviceHeight - state.stateBar
    }
  },
  mutations: {
    _clearHistory (state) {
      state.historyList = []
      window.localStorage.spc_history = JSON.stringify(state.historyList)
    },
    _setStorage (state, data) {
      const history = state.historyList
      history.includes(data) || history.push(data)
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
    _record (store, { type, value }) {
      const state = store.state
      let oldValue = state
      type.split('/').forEach(prop => {
        oldValue = oldValue[prop]
      })
      if (oldValue !== value) {
        state._records.push([type, oldValue])
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
          if (payload !== undefined) {
            state[propKey] = payload
          }
        }
      },
      // 过滤 前缀_表示内部数据
      ownKeys (target) {
        return Object.keys(target).filter(key => key[0] !== '_')
      }
    })
  }
}
