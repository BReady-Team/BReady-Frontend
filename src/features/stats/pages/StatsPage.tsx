import { useState } from 'react'
import { mockPlans } from '@/features/plans/mock/mockPlans'
import { mockPlanStats, mockSwitchLogs } from '../mock/mockStats'

import StatsSummaryCard from '../components/StatsSummaryCard'
import TriggerAnalysis from '../components/TriggerAnalysis'
import RecentActivity from '../components/RecentActivity'
import PlanStatsList from '../components/PlanStatsList'

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all')

  /* 요약 계산 */
  const totalPlans = mockPlans.length
  const totalSwitches = mockPlanStats.reduce((acc, s) => acc + s.totalSwitches, 0)
  const avgSwitchesPerPlan = totalPlans > 0 ? (totalSwitches / totalPlans).toFixed(1) : '0'

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 헤더 */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">통계</h1>
          <p className="mt-1 text-sm text-muted-foreground">플랜 변경 기록과 패턴을 분석합니다</p>
        </div>

        {/* 기간 필터 (UI만, 로직은 아직 X) */}
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

      {/* 요약 카드 */}
      <StatsSummaryCard
        totalPlans={totalPlans}
        totalSwitches={totalSwitches}
        avgSwitchesPerPlan={avgSwitchesPerPlan}
        recentCount={mockSwitchLogs.length}
      />

      <div className="grid gap-8 lg:grid-cols-5 mt-10">
        <TriggerAnalysis stats={mockPlanStats} />
        <RecentActivity logs={mockSwitchLogs} />
      </div>

      <PlanStatsList plans={mockPlans} stats={mockPlanStats} />
    </div>
  )
}
