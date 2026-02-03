import axios from 'axios'
import { http } from '@/lib/http'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface SignupRequest {
  nickname: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export const signup = (payload: SignupRequest) => {
  return api.post('/api/v1/auth/signup', payload)
}

export const loginApi = (payload: LoginRequest) => {
  return http.post<{
    data: TokenResponse
  }>('/api/v1/auth/login', payload)
}
