export type UserProfile = {
  nickname: string
  email: string
  bio: string
  avatarUrl?: string
  joinedAt: string
}

export type MyPageStats = {
  totalPlans: number
  totalSwitches: number
  totalSwitchLogs: number
}

export type RecentPlanItem = {
  id: string
  title: string
  date: string
  region: string
}

export type MyPageDTO = {
  profile: UserProfile
  stats: MyPageStats
  recentPlans: RecentPlanItem[]
}
