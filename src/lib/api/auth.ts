import { http } from '@/lib/http'

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
  return http.post('/api/v1/auth/signup', payload)
}

export const loginApi = (payload: LoginRequest) => {
  return http.post<{
    data: TokenResponse
  }>('/api/v1/auth/login', payload)
}
