import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Sisipkan token Bearer otomatis jika tersedia di localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sintasi_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Bersihkan sesi lokal dan arahkan ke halaman login saat token kedaluwarsa (401)
api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('sintasi_token')
    localStorage.removeItem('sintasi_user')
    if (window.location.hash !== '#/' && window.location.hash !== '#/login') {
      window.location.hash = '#/login'
      Notify.create({
        type: 'warning',
        message: 'Sesi Anda telah berakhir. Silakan login kembali.'
      })
    }
  }
  return Promise.reject(error)
})

export { api }
export default ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
}
