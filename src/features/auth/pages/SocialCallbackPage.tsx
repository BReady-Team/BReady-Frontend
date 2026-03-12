import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { kakaoLoginApi, naverLoginApi } from '@/lib/api/auth'

type Provider = 'KAKAO' | 'NAVER'

interface Props {
  provider: Provider
}

export default function SocialCallbackPage({ provider }: Props) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const login = useAuthStore(state => state.login)

  useEffect(() => {
    const code = params.get('code')
    const state = params.get('state')

    if (!code) {
      navigate('/login')
      return
    }

    const run = async () => {
      try {
        const res =
          provider === 'KAKAO' ? await kakaoLoginApi(code) : await naverLoginApi(code, state!)

        const { accessToken, refreshToken, user } = res.data.data

        login({
          accessToken,
          refreshToken,
          user: {
            id: user.userId,
            email: user.email,
            nickname: user.nickname,
            joinedAt: user.joinedAt,
            profileImageUrl: user.profileImageUrl,
          },
        })

        navigate('/plans')
      } catch {
        navigate('/login')
      }
    }

    run()
  }, [params, navigate, login, provider])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mb-4"></div>
      <p className="text-sm opacity-80">
        {provider === 'KAKAO' ? '카카오 로그인 처리 중...' : '네이버 로그인 처리 중...'}
      </p>
    </div>
  )
}
