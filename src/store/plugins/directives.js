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
function modify (modifiers, value) {
  if (modifiers.trim && typeof value === 'string') {
    value = value.trim()
  }
  if (modifiers.number && typeof value === 'string') {
    value = value.replace(/\D/g, '')
  }
  return value
}
// 暴露给外部调用
function _emitElement (key, value) {
  const wk = _emitQueue[key]
  if (wk) {
    wk.forEach(([el, prop]) => {
      el[prop] = value
    })
  }
}
const commit = function (store, callback) {
  // 重写store的commit函数
  const _commit = store.commit
  store.commit = function (mutations, payload, isEmit) {
    _commit.call(this, mutations, payload)
    if (!isEmit) {
      _emitElement(this.state)
    }
  }
  // 返回指令
  return {
    bind (el, { value, expression, name, modifiers }, VNode) {
      console.log(el)
      if (el.nodeName === 'INPUT') {
        const { prop, event } = formMap[el.type]
        const temp = modify.bind(null, modifiers)
        el[prop] = temp(value)
        el.addEventListener(event, () => {
          const value = temp(el[prop])
          callback(value)
        })
        _listenElement(el, prop)
      }
    },
    unbind (el, { expression }) {
      _unbindElement(el)
    }
  }
}
export default commit
