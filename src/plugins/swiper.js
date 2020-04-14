'use strict'

import Vue from 'vue'
import Swiper from 'swiper'
const Plugin = {}
Plugin.install = function (Vue, options) {
  Vue.prototype.$swiper = function (el, config) {
    return new Swiper(el, Object.assign(config, { speed: 500 }))
  }
}

Vue.use(Plugin)

export default Plugin
