import formMap from './form-map'
import Vue from 'vue'

export default store => {
  const drtName = 'commit'
  const _emitQueue = {}
  // 绑定elem和prop
  function _listenElement (key, el, prop) {
    let wk = _emitQueue[key]
    if (!wk) {
      wk = _emitQueue[key] = []
      let obj = store.state; let prop
      key.split('/').forEach((v, i, arr) => {
        if (i !== arr.length - 1) {
          obj = obj[v]
        } else {
          prop = v
        }
      })
      const _setter = Object.getOwnPropertyDescriptor(obj, prop).set
      Object.defineProperty(obj, prop, {
        set (value) {
          _emitElement(key, value)
          return _setter(value)
        }
      })
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

  // 与store的mapVuex，bindMutation耦合
  Vue.mixin({
    directives: {
      [drtName]: {
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
              store.commit(type, value)
            })
            _listenElement(type, el, prop)
          }
        },
        unbind (el, { expression }) {
          el = _iterator(el, 'INPUT')
          if (el) {
            const type = expression.replace('.', '/')
            _unbindElement(type, el)
          }
        }
      }
    }
  })
}
