import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/views/login-page/Login.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import store from "@/store/store.js";

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {

  const token = store.state.token
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }

})

router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (!token) {
    token = localStorage.getItem("token")
    if (token) {
      store.commit("setToken", token)
    }
  }

  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }

  if (to.path === '/login') {
    store.commit("clearToken")
    localStorage.removeItem("token")
  }
})

export default router
