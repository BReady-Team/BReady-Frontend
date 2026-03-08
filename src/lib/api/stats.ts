import { http } from '@/lib/http'
import type {
  PlanActivitiesResponse,
  PlanStatsResponse,
  RecentActivitiesResponse,
  StatsPeriod,
  StatsSummaryResponse,
  TriggerStatsResponse,
} from '@/features/stats/types/statsTypes'

interface CommonResponse<T> {
  message: string
  data: T
}

export async function getStatsSummary(period: StatsPeriod) {
  const res = await http.get<CommonResponse<StatsSummaryResponse>>('/api/v1/stats/summary', {
    params: { period },
  })
  return res.data.data
}

export async function getTriggerStats(period: StatsPeriod) {
  const res = await http.get<CommonResponse<TriggerStatsResponse>>('/api/v1/stats/triggers', {
    params: { period },
  })
  return res.data.data
}

export async function getPlanStats(period: StatsPeriod, limit?: number) {
  const res = await http.get<CommonResponse<PlanStatsResponse>>('/api/v1/stats/plans', {
    params: { period, ...(limit ? { limit } : {}) },
  })
  return res.data.data
}

export async function getRecentActivities(period: StatsPeriod, limit?: number) {
  const res = await http.get<CommonResponse<RecentActivitiesResponse>>('/api/v1/stats/activities', {
    params: { period, ...(limit ? { limit } : {}) },
  })
  return res.data.data
}

export async function getPlanActivities(planId: number, limit?: number) {
  const res = await http.get<CommonResponse<PlanActivitiesResponse>>(
    `/api/v1/stats/plans/${planId}/activities`,
    {
      params: { ...(limit ? { limit } : {}) },
    },
  )
  return res.data.data
}
