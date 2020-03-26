import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
import commit from './plugins/directives'
Vue.use(Vuex)

const root = {
  name: '',
  state: {
    loading: false
  },
  getters: {

  },
  mutations: {
    ...new Proxy({ loading: false }, {
      get (target, propKey, receiver) {
        return (state, payload) => {
          console.log(propKey)
          if (propKey in state) {
            state[propKey] = payload
          }
        }
      }
    })
  },
  actions: {

  },
  // 加载模块
  modules: {
    login,
    map
  }
}
bindMutations(root, { commit })
//
export const store = new Vuex.Store(root)

commit(store)
export const vuexData = {
  ...mapVuex(root)
}
//
function everyModule (root, fn) {
  Object.values({ root, ...root.modules }).forEach(fn)
}
function bindMutations (root, fns) {
  Object.entries(fns).forEach(([prop, fn]) => {
    everyModule(root, module => {
      module.mutations[prop] = fn
    })
  })
}
function mapVuex (root) {
  const map = {
    computed: ['state', 'getters'],
    methods: ['mutations', 'actions']
  }
  const vuexData = {
    computed: {},
    methods: {}
  }
  everyModule(root, module => {
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
    fn = fn.bind(Vuex, module.name)
  }
  if (str === 'mutations' || str === 'actions') {
    keys = keys.reduce((acc, key) => {
      if (!key.includes('_')) {
        acc[module.name + '_' + key] = key
      }
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}
// function commit (state, { value, chain, event }) {
//   console.log(value)
//   // 要限制exp的内容
//   // new Function('window', 'state', 'value', `state.${exp}=value`)(null, state, value)
//   chain.split('.').forEach((key, i, arr) => {
//     if (i !== arr.length - 1) {
//       state = state[key]
//     } else {
//       state[key] = value
//     }
//   })
//   if (!event) {
//     store.commit('_emitElement', { key: chain, value })
//   }
// }
