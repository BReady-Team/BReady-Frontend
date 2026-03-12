import { http } from '@/lib/http'
import type { SocialLoginResponse } from '@/features/auth/types'

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

export const kakaoLoginApi = (code: string) => {
  return http.post<{
    data: SocialLoginResponse
  }>('/api/v1/auth/kakao/login', { code })
}

export const naverLoginApi = (code: string, state: string) => {
  return http.post<{
    data: SocialLoginResponse
  }>('/api/v1/auth/naver/login', {
    code,
    state,  
})}
