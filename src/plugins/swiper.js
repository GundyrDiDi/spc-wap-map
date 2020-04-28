'use strict'

import Vue from 'vue'
import Swiper from 'swiper'
const Plugin = {}
Plugin.install = function (Vue, options) {
  Vue.prototype.$swiperSpeed = 500
  Vue.prototype.$swiper = function (el, config) {
    return new Swiper(el, {
      speed: 500,
      updateOnWindowResize: false,
      // roundLengths:true,
      ...config
    })
  }
}

Vue.use(Plugin)

export default Plugin
