import Vue from 'vue'
import './plugins/element.js'
import './plugins/axios'
// import _ from 'lodash'
import App from './App.vue'
import router from './router'
// 绑定store里state,getter,mutation,action
import { vuexData, store } from './store'

Vue.config.productionTip = false
Vue.mixin(vuexData)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
