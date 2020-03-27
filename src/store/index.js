import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import login from './modules/login'
import { commitAction, commitPlugin, commitDrt } from './plugins/commit'

Vue.use(Vuex)
const root = {
  name: '',
  state: {
    loading: false
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    ...commitAction
  },
  modules: {
    login,
    map
  },
  plugins: [
    commitPlugin
  ]
}
// 每一个module里的state数据通过mutations改变
bindMutations(root)

export const store = new Vuex.Store(root)

export const vuexData = {
  ...mapVuex(root),
  directives: {
    commit: commitDrt
  }
}
console.log(store)
//
function everyModule (root, fn) {
  // let tree={root};
  // function foreach(modules,name){
  //   Object.entries(modules).forEach(([prop,module])=>{
  //     tree[`${name}${prop}`]=module;
  //     if(module.modules){
  //       foreach(module.modules,`${name}${prop}_`)
  //     }
  //   })
  // }
  // foreach(root.modules,'');
  // console.log(tree);
  Object.values({ root, ...root.modules }).forEach(fn)
}
function bindMutations (root) {
  everyModule(root, module => {
    module.mutations = {
      ...module.mutations,
      ...new Proxy(module.state, {
        get (target, propKey, receiver) {
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
      if (key.includes('_')) {
        acc[module.name + key] = key
      }
      return acc
    }, {})
  }
  return fn.call(Vuex, keys)
}
