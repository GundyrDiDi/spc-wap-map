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
// mock
const url = 'http://api/'
const mockdata = {
  login (obj) {
    const { username } = JSON.parse(obj.body)
    return {
      data: username === 'username'
    }
  },
  getlayers: {

  }

}
Object.entries(mockdata).forEach(([api, redata]) => {
  Mock.mock(url + api, redata)
})
api.setOrigin(url).add(Object.keys(mockdata))
