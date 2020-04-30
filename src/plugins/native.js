import { store } from '../store'
export default async function () {
  const state = store.state
  // 获取状态栏高度
  var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
  console.log(ms)
  if (ms && ms.length >= 3) {
    store.commit('truestateBar', parseFloat(ms[2]))
    console.log(store.state.truestateBar)
  }
  // 地理位置
  plus.geolocation.watchPosition(p => {
    store.commit('map/deviceLocation', p)
    console.log(p)
  })
  // 返回按钮事件
  plus.key.addEventListener('backbutton', () => {
    console.log('BackButton Key pressed!')
    if (state._records.length !== 0) {
      store.dispatch('_goback')
    } else {
      var c = confirm('是否退出？')
      if (c) {
        plus.runtime.quit()
      }
    }
  })
  //
  // 键盘事件
  document.addEventListener('keyboardchange', e => {
    console.log(e)
    console.log('键盘显示')
  }, false)
  //
  console.log(plus)
}
