import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
Vue.use(Vuex)

const root = {
  name: '',
  state: {
    self: 'root'
  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  // 加载模块
  modules: {
    login: login,
    map
  }
}
bindMutations(root, { commit })
//
export const store = new Vuex.Store(root)

export const vuexData = {
  ...mapVuex(root),
  ...createDirectives()
}
//
function createDirectives () {
  const directives = {}
  directives.commit = {
    inserted (el, { value, arg, expression, name }) {
      if (el.nodeName === 'INPUT') {
        if (el.type === 'text' || el.type === 'password') {
          el.value = value
          el.addEventListener('input', () => {
            store.commit(arg ? `${arg}/${name}` : name, { value: el.value, key: expression })
          })
        } else if (el.type === 'checkbox') {

        } else if (el.type === 'radio') {

        }
      }
    },
    unbind (el) {

    }
  }
  return { directives }
}
function everyModule (root, fn) {
  const modules = {
    root,
    ...root.modules
  }
  Object.values(modules).forEach(fn)
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
      acc[module.name + '_' + key] = key
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}
function commit (state, { value, key, exp }) {
  if (exp) {
    new Function('window', 'state', 'value', `state.${exp}=value`)(null, state, value)
  } else if (key) {
    state[key] = value
  }
}
// function camelCase () {

// }
