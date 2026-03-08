import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import StatsSummaryCard from '../components/StatsSummaryCard'
import TriggerAnalysis from '../components/TriggerAnalysis'
import RecentActivity from '../components/RecentActivity'
import PlanStatsList from '../components/PlanStatsList'

import {
  getPlanStats,
  getRecentActivities,
  getStatsSummary,
  getTriggerStats,
} from '@/lib/api/stats'

import type {
  PlanStatsResponse,
  RecentActivitiesResponse,
  StatsPeriod,
  StatsSummaryResponse,
  TriggerStatsResponse,
} from '../types/statsTypes'

type UiPeriod = 'week' | 'month' | 'all'

const periodMap: Record<UiPeriod, StatsPeriod> = {
  week: 'WEEK',
  month: 'MONTH',
  all: 'ALL',
}

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<UiPeriod>('all')

  const [summary, setSummary] = useState<StatsSummaryResponse | null>(null)
  const [triggerStats, setTriggerStats] = useState<TriggerStatsResponse | null>(null)
  const [planStats, setPlanStats] = useState<PlanStatsResponse | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivitiesResponse | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const apiPeriod = useMemo(() => periodMap[selectedPeriod], [selectedPeriod])

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [summaryRes, triggerRes, planRes, recentRes] = await Promise.all([
        getStatsSummary(apiPeriod),
        getTriggerStats(apiPeriod),
        getPlanStats(apiPeriod, 50),
        getRecentActivities(apiPeriod, 5),
      ])

      setSummary(summaryRes)
      setTriggerStats(triggerRes)
      setPlanStats(planRes)
      setRecentActivities(recentRes)
    } catch (error) {
      console.error('통계 조회 실패:', error)

      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message ?? '통계 데이터를 불러오지 못했습니다.')
      } else {
        setErrorMessage('통계 데이터를 불러오지 못했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiPeriod])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">통계</h1>
          <p className="mt-1 text-sm text-muted-foreground">플랜 변경 기록과 패턴을 분석합니다</p>
        </div>

        <div className="flex gap-1 rounded-lg bg-secondary/50 p-1">
          {(['week', 'month', 'all'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                selectedPeriod === period ? 'bg-background shadow' : 'text-muted-foreground'
              }`}
            >
              {period === 'week' ? '이번 주' : period === 'month' ? '이번 달' : '전체'}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <StatsSummaryCard
        totalPlans={summary?.totalPlans ?? 0}
        totalSwitches={summary?.totalSwitches ?? 0}
        avgSwitchesPerPlan={summary?.avgSwitchesPerPlan ?? 0}
        recentCount={summary?.recentCount ?? 0}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <TriggerAnalysis
          items={triggerStats?.items ?? []}
          totalCount={triggerStats?.totalCount ?? 0}
        />
        <RecentActivity items={recentActivities?.items ?? []} />
      </div>

      <PlanStatsList items={planStats?.items ?? []} />

      {isLoading && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          통계 데이터를 불러오는 중입니다...
        </div>
      )}
    </div>
  )
}
