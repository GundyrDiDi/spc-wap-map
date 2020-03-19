import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
Vue.use(Vuex)

const store = {
  state: {

  },
  getters: {

  },
  mutations: {
    _commit (state, { value, exp, module, key }) {
      if (exp) {
        // new Function('state', 'value', `state.${exp}=value`)(state,value)
        const [key, ...args] = exp.split('.').reverse()
        state = args.reduceRight((acc, key) => (acc[key]), state)
        state[key] = value
      } else {
        state[module][key] = value
      }
    }
  },
  actions: {

  },
  // 加载模块
  modules: {
    login,
    map
  }
}
//
export const Store = new Vuex.Store(store)

export const vuexData = Vue.extend({
  computed: {
    ...mapkeys('state', login),
    ...mapkeys('state', map)
  },
  methods: {
    ...mapkeys('mutations', map)
  }
})
//
function mapkeys (str, module = store) {
  let fn = Vuex['map' + str.slice(0, 1).toUpperCase() + str.slice(1)]
  let keys = Object.keys(module[str])
  if (module.name) {
    fn = fn.bind(Vuex, module.name)
  }
  if (module.rootname) {
    keys = keys.reduce((acc, key) => ({
      ...acc,
      [module.name + '_' + key]: key
    }), {})
  }
  return fn.call(Vuex, keys)
}

// function camelCase () {

// }
