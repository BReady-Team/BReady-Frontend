import type { MyPageDTO } from '../types'

export const mockMyPage: MyPageDTO = {
  profile: {
    nickname: '여행러버',
    email: 'user@example.com',
    bio: '매주 새로운 곳을 탐험하는 것을 좋아합니다.',
    joinedAt: '2024-01-15T00:00:00.000Z',
  },
  stats: {
    totalPlans: 3,
    totalSwitches: 2,
    totalSwitchLogs: 3,
  },
  recentPlans: [
    { id: 'plan-1', title: '성수동 데이트', date: '2025-01-20', region: '서울 성수동' },
    { id: 'plan-2', title: '홍대 일정', date: '2025-01-25', region: '서울 홍대' },
    { id: 'plan-3', title: '강남 미팅', date: '2025-02-01', region: '서울 강남' },
  ],
}
