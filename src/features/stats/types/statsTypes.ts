import type { TriggerType } from '@/types/plan'

export type StatsPeriod = 'WEEK' | 'MONTH' | 'ALL'
export type DecisionType = 'KEEP' | 'SWITCH'

export interface StatsSummaryResponse {
  period: StatsPeriod
  totalPlans: number
  totalSwitches: number
  avgSwitchesPerPlan: number
  recentCount: number
}

export interface TriggerStatsItem {
  triggerType: TriggerType
  count: number
  percentage: number
}

export interface TriggerStatsResponse {
  period: StatsPeriod
  totalCount: number
  items: TriggerStatsItem[]
}

export interface PlanStatsItem {
  planId: number
  planTitle: string
  planDate: string
  region: string
  categoryTypes: string[]
  totalSwitches: number
}

export interface PlanStatsResponse {
  period: StatsPeriod
  items: PlanStatsItem[]
}

export interface RecentActivityItem {
  activityId: string
  planId: number
  planTitle: string
  triggerType: TriggerType
  decisionType: DecisionType
  createdAt: string
}

export interface RecentActivitiesResponse {
  period: StatsPeriod
  limit: number
  items: RecentActivityItem[]
}

export interface PlanActivityItem {
  activityId: string
  triggerType: TriggerType
  decisionType: DecisionType
  createdAt: string
}

export interface PlanActivitiesResponse {
  planId: number
  planTitle: string
  limit: number
  items: PlanActivityItem[]
}
