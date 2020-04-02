import Mock from 'mockjs'
class API {
  constructor (path) {
    this.__path = path
  }

  setOrigin (path) {
    API.prototype.originPath = path
    return this
  }

  // 添加同源API
  add (apis) {
    apis.forEach(api => {
      Object.defineProperty(this, api.name || api, {
        value: api.url || api,
        writable: false,
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
const proxy = new Proxy(api, {
  get (target, key, receiver) {
    key = key.split('/').pop()
    if (key in target && !key.includes('__')) {
      return `${target.originPath}${target[key]}`
    } else {
      return new Error('wrong api !')
    }
  }
})
export default proxy

const path = 'http://api/'
api.setOrigin(path).add([
  'login',
  'getusers'
])
console.log(api)
Mock.mock(`${path}login`, {

})
Mock.mock(`${path}getusers`, {
  'user|5-10': [{
    name: '@cname',
    'age|1-100': 100,
    birthday: '@date("yyyy-MM-dd")',
    city: '@city(true)'
  }]
})
