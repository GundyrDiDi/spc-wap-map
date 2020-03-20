import Vue from 'vue'
import Vuex from 'vuex'
import formMap from './modules/form-map'
import map from './modules/map'
import login from './modules/login'
Vue.use(Vuex)

const root = {
  name: '',
  state: {
    _emitQueue: {},
    self: 'root',
    istrue: true
  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  // 加载模块
  modules: {
    login,
    map
  }
}
bindMutations(root, { commit, _emitElement, _listernElement })
//
export const store = new Vuex.Store(root)

export const vuexData = {
  ...mapVuex(root),
  ...createDirectives(store, formMap, modify)
}
//
function createDirectives (store, formMap, modify) {
  const directives = {}
  directives.commit = {
    inserted (el, { value, arg, expression, name, modifiers }) {
      if (el.nodeName === 'INPUT') {
        const { prop, event } = formMap[el.type]
        const temp = modify.bind(null, modifiers)
        el[prop] = temp(value)
        store.commit('_listernElement', { key: `${arg}_${expression}`, el, prop })
        el.addEventListener(event, () => {
          store.commit(arg ? `${arg}/${name}` : name, { value: temp(el[prop]), key: expression, event: true })
        })
      }
    }
  }
  return { directives }
}
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
      acc[module.name + '_' + key] = key
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}
function commit (state, { value, key, exp, event }) {
  if (exp) {
    new Function('window', 'state', 'value', `state.${exp}=value`)(null, state, value)
  } else if (key) {
    state[key] = value
  }
  if (!event) {
    store.commit('_emitElement', exp)
  }
}
function _emitElement (state, key) {
  const wk = state._emitQueue
  console.log(wk)
}
function _listernElement (state, { key, el, prop }) {
  let wk = state._emitQueue[key]
  if (!wk) {
    wk = state._emitQueue[key] = new WeakMap()
  }
  wk.set(el, prop)
  console.log(wk)
}
function modify (modifiers, value) {
  if (modifiers.trim && typeof value === 'string') {
    value = value.trim()
  }
  if (modifiers.number && typeof value === 'string') {
    value = parseFloat(value)
  }
  return value
}
// function camelCase () {

// }
