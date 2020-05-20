'use strict'

import Vue from 'vue'
import axios from 'axios'
import api from '../api'
import { store } from '../store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  // adapter 允许自定义处理请求，以使测试更轻松
  // adapter(config){
  //   console.log(config);
  //   return config
  // }
  // responseType: 'json'
}

const _axios = axios.create(config)
// 请求拦截器
_axios.interceptors.request.use(
  function (config) {
    // 控制一般请求的store.isloading
    store.commit('isloading', true)
    // 获得api的url
    config.url = api[config.url]
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 返回响应拦截器
// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        if (response.data.type === false) {
          reject(new Error('返回数据错误'))
        }
        // 返回格式
        store.commit('isloading', false)
        resolve(response.data.data)
        //
      }, 20)
    })
  },
  function (error) {
    // 错误返回对象
    console.log(error.response.status)
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  window.api = api
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
