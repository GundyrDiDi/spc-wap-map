import Vue from 'vue'
import { store } from '../store'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// lazy load
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/home',
  name: 'Home',
  component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  beforeEnter: (to, from, next) => {
    console.log(store)
    if (store.state.login.isLogin) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
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
      next({ name: 'Home' })
    }
  }
}
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
