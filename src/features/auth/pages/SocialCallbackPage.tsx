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
                provider === 'KAKAO'
                ? await kakaoLoginApi(code)
                : await naverLoginApi(code, state!)

                const { accessToken, refreshToken, user } = res.data.data

                login({
                    accessToken,
                    refreshToken,
                    user : {
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
        <div className='flex item-center justify-center h-screen'>
            <h1>{provider} 로그인 중...</h1>
        </div>
    )
}