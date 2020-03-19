import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
Vue.use(Vuex)

const root = {
  state: {
    self: 'root'
  },
  getters: {

  },
  mutations: {
    _commit (state, { value, exp, module, key }) {
      if (exp) {
        new Function('state', 'value', `state.${exp}=value`)(state, value)
        // const [key, ...args] = exp.split('.').reverse()
        // state = args.reduceRight((acc, key) => (acc[key]), state)
        // state[key] = value
      } else {
        state[module][key] = value
      }
    }
  },
  actions: {

  },
  // 加载模块
  modules: {
    login: login,
    map
  }
}
//
export const store = new Vuex.Store(root)

export const vuexData = mapVuex(root)
//
function mapVuex (root) {
  const modules = {
    root,
    ...root.modules
  }
  const map = {
    computed: ['state', 'getters'],
    methods: ['mutations', 'actions']
  }
  const vuexData = {
    computed: {},
    methods: {}
  }
  Object.values(modules).forEach(module => {
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
  if (module.rootname) {
    keys = keys.reduce((acc, key) => {
      acc[module.name + '_' + key] = key
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}

// function camelCase () {

// }
