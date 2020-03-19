import Vue from 'vue'
class API {
  // constructor (path) {

  // }

  setOrigin (path) {
    API.prototype.originPath = path
  }

  // 添加同源API
  add (apis) {
    apis.forEach(api => {
      Object.defineProperty(API.prototype, api, {
        value: api,
        writable: true,
        enumerable: false,
        configurable: false
      })
    })
  }

  // 添加跨域API
  cross (apis) {

  }
}
const api = new API()
api.setOrigin('./')
api.add(['getdata'])

const proxy = new Proxy(api, {
  get (target, key, receiver) {
    if (key in target && !key.includes('__')) {
      return `${target.originPath}${target[key]}`
    } else {
      return new Error('wrong api !')
    }
  }
})
Vue.prototype.api = proxy
