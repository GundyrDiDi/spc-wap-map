import Vue from 'vue'
import './plugins/element.js'
import './plugins/axios'
import './plugins/swiper'
import './assets/animate.css'
import './assets/common.css'
// import _ from 'lodash'
import App from './App.vue'
import router from './router'
import VConsole from 'vconsole'
// 绑定store里state,getter,mutation,action
import { vuexData, store } from './store'
import handlerNative from './plugins/native'
Vue.mixin(vuexData)
Vue.config.productionTip = false

if (navigator.platform.includes('Win')) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
} else {
  document.addEventListener('plusready', async function () {
    await handlerNative()
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}
//
const v = new VConsole()
window.v = v
