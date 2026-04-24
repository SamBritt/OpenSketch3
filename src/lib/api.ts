import axios from 'axios'
import { API_URL } from '@/config'

console.log('API baseURL:', `${API_URL}/api`)

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

export default api
