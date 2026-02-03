import axios from 'axios'

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

export const signup = (payload: SignupRequest) => {
  return api.post('/api/v1/auth/signup', payload)
}
