'use strict'

import Vue from 'vue'
import Swiper from 'swiper'
const Plugin = {}
Plugin.install = function (Vue, options) {
  Vue.prototype.$swiper = function (...options) {
    return new Swiper(...options)
  }
}

Vue.use(Plugin)

export default Plugin
