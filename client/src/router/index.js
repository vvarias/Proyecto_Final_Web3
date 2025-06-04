// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login      from '../views/Login.vue'
import Register   from '../views/Register.vue'
import Dashboard  from '../views/Dashboard.vue'
import Compras    from '../views/ComprasWrapper.vue'
import Medicacion from '../views/MedicacionWrapper.vue'
import Gastos     from '../views/GastosWrapper.vue'
import Reportes   from '../views/Reportes.vue'
import { useAuthStore } from '../store/auth.js'

const routes = [
  { path: '/login',    name: 'Login',    component: Login },
  { path: '/register', name: 'Register', component: Register },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'), // o Home.vue, etc.
    meta: { requiresAuth: true },
    children: [
      { path: '',           name: 'Compras',    component: Compras },
      { path: 'medicacion', name: 'Medicacion', component: Medicacion },
      { path: 'gastos',     name: 'Gastos',      component: Gastos },
      { path: 'reportes',   name: 'Reportes',    component: Reportes }
    ]
  },

  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: 'Login' })
  }
  next()
})

export default router