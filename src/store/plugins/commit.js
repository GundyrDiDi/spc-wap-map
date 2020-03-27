import formMap from './form-map'

const _emitQueue = {}
// 绑定elem和prop
function _listenElement (key, el, prop) {
  let wk = _emitQueue[key]
  if (!wk) {
    wk = _emitQueue[key] = []
  }
  wk.push([el, prop])
}
// 解绑elem和prop
function _unbindElement (key, el) {
  const wk = _emitQueue[key]
  if (wk) {
    wk.some(([elm], i, arr) => {
      if (elm === el) {
        arr.splice(i, 1)
        return true
      }
    })
  }
}
// 触发elem
function _emitElement (key, value) {
  const wk = _emitQueue[key]
  if (wk) {
    wk.forEach(([el, prop]) => {
      el[prop] = value
    })
  }
}
function _iterator (el, nodeName) {
  const arr = [el]; let i = 0
  while (i < arr.length && arr[i].nodeName !== nodeName) {
    const children = arr[i].children
    if (children) {
      arr.push(...children)
    }
    i++
  }
  return arr[i]
}
// 修饰符
function modify (modifiers, value) {
  if (modifiers.trim && typeof value === 'string') {
    value = value.trim()
  }
  if (modifiers.number && typeof value === 'string') {
    value = value.replace(/\D/g, '')
  }
  return value
}
let _store = {}
// 通过插件暴露给 store 调用
// 注意：与store的bindMUtations耦合
export const commitPlugin = store => {
  _store = store
  store.subscribe(({ type, payload: value }, state) => {
    // mutation 的格式为 { type, payload }
    if (type in _emitQueue) {
      _emitElement(type, value)
    }
  })
}
// 在store上注册action，在指令中调用，也暴露给实例调用
// 注意：与store的bindMUtations耦合
const _action = '_commit'
export const commitAction = {
  [_action] (store, { type, value }) {
    store.commit(type, value)
  }
}
// 创建指令
// 注意：与store的bindMUtations耦合
export const commitDrt = {
  bind (el, { value, expression, name, modifiers }, VNode) {
    // 找到el下的input元素
    el = _iterator(el, 'INPUT')
    if (el) {
      const { prop, event } = formMap[el.type]
      const temp = modify.bind(null, modifiers)
      const type = expression.replace('.', '/')

      el[prop] = temp(value)
      el.addEventListener(event, () => {
        const value = temp(el[prop])
        _store.dispatch(_action, { type, value })
      })
      _listenElement(type, el, prop)
    }
  },
  unbind (el, { expression }) {
    el = _iterator(el, 'INPUT')
    if (el) {
      _unbindElement(expression, el)
    }
  }
}
// 另一种模块方式是只打包plugin，
// plugin中动态加载一个匿名store模块，
// 注册action并在Vue中直接混入指令
