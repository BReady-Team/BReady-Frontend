import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()

  const login = useAuthStore(state => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      /* TODO (나중에 API 붙이면 됨)
       *
       * const res = await authApi.login({ email, password })
       * login({
       *   accessToken: res.data.accessToken,
       *   refreshToken: res.data.refreshToken,
       *   user: res.data.user,
       * })
       */

      // 지금은 mock 로그인으로 대체
      await new Promise(resolve => setTimeout(resolve, 500))

      login({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          email,
          nickname: '승인',
        },
      })

      navigate('/plans')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'KAKAO' | 'NAVER') => {
    setIsLoading(true)

    setTimeout(() => {
      login({
        accessToken: `${provider.toLowerCase()}-mock-access-token`,
        refreshToken: `${provider.toLowerCase()}-mock-refresh-token`,
        user: {
          id: 2,
          email: `${provider.toLowerCase()}@bready.dev`,
          nickname: provider === 'KAKAO' ? '카카오유저' : '네이버유저',
        },
      })

      navigate('/plans')
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">BReady</h1>
          <p className="mt-2 text-sm text-muted-foreground">하루를 설계하다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialLogin('KAKAO')}
          >
            <KakaoIcon className="mr-2 h-5 w-5" />
            카카오로 시작하기
          </Button>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialLogin('NAVER')}
          >
            <NaverIcon className="mr-2 h-5 w-5" />
            네이버로 시작하기
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.643 1.763 4.963 4.412 6.287-.137.458-.883 2.96-.912 3.158 0 0-.018.151.079.209.097.058.211.014.211.014.279-.039 3.235-2.102 3.743-2.461.479.068.974.103 1.467.103 5.523 0 10-3.463 10-7.31C21 6.463 17.523 3 12 3" />
    </svg>
  )
}

function NaverIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  )
}
