import { store } from '../store'
export default function () {
  const state = store.state
  // 获取状态栏高度
  var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
  if (ms && ms.length >= 3) {
    store.commit('stateBar', parseFloat(ms[2]))
  }
  // 地理位置
  plus.geolocation.getCurrentPosition(p => {
    console.log(p)
    store.commit('map/deviceCoord', p)
  })
  // 返回按钮事件
  plus.key.addEventListener('backbutton', () => {
    console.log('BackButton Key pressed!')
    if (state.hasRecord) {
      store.dispatch('_goback')
    } else {
      var c = confirm('是否退出？')
      if (c) {
        plus.runtime.quit()
      }
    }
  })
  //
  console.log(plus)
}
