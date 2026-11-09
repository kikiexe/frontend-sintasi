import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory()
  })

  // Cegah akses halaman terproteksi tanpa token atau halaman login saat sudah autentikasi.
  Router.beforeEach((to) => {
    const token = localStorage.getItem('sintasi_token')
    if (to.meta.requiresAuth && !token) {
      return { name: 'login' }
    }
    if (to.name === 'login' && token) {
      return { name: 'dashboard' }
    }
  })

  return Router
}
