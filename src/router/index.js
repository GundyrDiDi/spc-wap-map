import Vue from 'vue'
import { store } from '../store'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// lazy load
import Home from '../views/Home.vue'
import HomeChildren from './home/children'

Vue.use(VueRouter)

const routes = [{
  path: '/home',
  name: 'Home',
  component: Home,
  beforeEnter: (to, from, next) => {
    console.log(store)
    if (store.state.login.isLogin) {
      next()
    } else {
      next({ name: 'Login' })
    }
  },
  // 嵌套路由
  children: HomeChildren
},
{
  path: '/',
  redirect: to => ({ name: 'Home' })
},
{
  path: '/login',
  name: 'Login',
  component: Login,
  beforeEnter: (to, from, next) => {
    if (!store.state.login.isLogin) {
      next()
    } else {
      console.log('返回主页面，进入后台!')
    }
  }
},
{
  path: '/test',
  name: 'Test',
  component: () => import('../components/test.vue')
}
]
const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
