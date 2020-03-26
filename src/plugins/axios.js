'use strict'

import Vue from 'vue'
import axios from 'axios'
import api from '../api'
import { store } from '../store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 20000

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)
// 请求拦截器
_axios.interceptors.request.use(
  function (config) {
    // 控制一般普通的请求的store.loading
    store.commit('loading', true)
    // store.commit('commit',{chain:'loading',value:true});
    // Do something before request is sent
    // console.log(config);
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
    return response
  },
  function (error) {
    // 错误返回对象
    console.log(error.response.status)
    // Do something with response error
    // return Promise.reject(error)
    return new Promise(resolve => {
      setTimeout(() => {
        store.commit('commit', { chain: 'loading', value: false })
        resolve(true)
      }, 3000)
    })
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
