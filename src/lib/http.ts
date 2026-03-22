import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
})

http.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRedirecting = false

http.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status

    if (status === 401 && !isRedirecting) {
      isRedirecting = true

      const { logout } = useAuthStore.getState()
      logout()

      alert('로그인 시간이 만료되었습니다. 다시 로그인해주세요.')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
