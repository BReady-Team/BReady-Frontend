import { http } from '@/lib/http'
import type { MyPageDTO } from './types'
import { getStatsSummary } from '@/lib/api/stats'

interface CommonResponse<T> {
  message: string
  data: T
}

export async function fetchMyPage(): Promise<MyPageDTO> {
  const [userRes, stats] = await Promise.all([
    http.get<CommonResponse<any>>('/api/v1/users/me'),
    getStatsSummary('ALL'),
  ])

  const data = userRes.data.data

  return {
    profile: {
      nickname: data.nickname,
      email: data.email,
      bio: data.bio ?? '',
      avatarUrl: data.profileImageUrl ?? undefined,
      joinedAt: data.joinedAt,
    },

    stats: {
      totalPlans: stats.totalPlans,
      totalSwitches: stats.totalSwitches,
      totalSwitchLogs: stats.recentCount,
    },

    recentPlans: [],
  }
}

export async function updateNickname(nickname: string) {
  await http.patch('/api/v1/users/profile/nickname', { nickname })
}

export async function updateBio(bio: string) {
  await http.patch('/api/v1/users/profile/bio', { bio })
}

export async function updateProfileImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await http.patch('/api/v1/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data.data
}
