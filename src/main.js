import Vue from 'vue'
import './plugins/element.js'
import './plugins/axios'
import './assets/animate.css'
import './assets/common.css'
import Swiper from 'swiper'
// import _ from 'lodash'
import App from './App.vue'
import router from './router'
// 绑定store里state,getter,mutation,action
import { vuexData, store } from './store'
Vue.prototype.Swiper = Swiper
Vue.config.productionTip = false
Vue.mixin(vuexData)
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
if (window.plus) {
  console.log(window.plus)
  console.log(app)
}
console.log(window.navigator)
