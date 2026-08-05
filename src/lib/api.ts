import axios from 'axios'
import { API_URL } from '@/config'

console.log('API baseURL:', `${API_URL}/api`)

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('os_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      import('@/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout()
      })
    }
    return Promise.reject(error)
  }
)

export default api
