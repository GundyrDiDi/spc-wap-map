import formMap from './form-map'
import Vue from 'vue'

export default store => {
  const drtName = 'commit'
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

  Vue.mixin({
    directives: {
      [drtName]: {
        // 与store的mapVuex，bindMutation耦合
        bind (el, { value, expression, modifiers }) {
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
          }
        },
        update (el, { value, modifiers }) {
          el = _iterator(el, 'INPUT')
          if (el) {
            const { prop } = formMap[el.type]
            el[prop] = modify(modifiers, value)
          }
        }
      }
    }
  })
}
