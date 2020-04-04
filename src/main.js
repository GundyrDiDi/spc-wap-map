import Vue from 'vue'
import './plugins/element.js'
import './plugins/axios'
import './plugins/swiper'
import './assets/animate.css'
import './assets/common.css'
// import _ from 'lodash'
import App from './App.vue'
import router from './router'
// 绑定store里state,getter,mutation,action
import { vuexData, store } from './store'
Vue.mixin(vuexData)
Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
//
if (window.plus) {
  console.log(window.plus)
  console.log(app)
}
console.log(window.navigator)
