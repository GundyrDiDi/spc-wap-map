'use strict'

import Vue from 'vue'
import echarts from 'echarts'
const Plugin = {}
Plugin.install = function (Vue, options) {
  Vue.prototype.$echarts = function (el, config) {
    return echarts.init(el)
  }
}

Vue.use(Plugin)

export default Plugin
