import type { Plan } from '@/types/plan'
import type { PlanStats } from '../types/statsTypes'
import { Link } from 'react-router-dom'

export default function PlanStatsList({ plans, stats }: { plans: Plan[]; stats: PlanStats[] }) {
  return (
    <div className="mt-8 rounded-2xl border border-border/50 bg-card">
      <div className="border-b p-6">
        <h2 className="font-medium">플랜별 통계</h2>
        <p className="text-sm text-muted-foreground">각 플랜의 전환 기록</p>
      </div>

      <div className="divide-y">
        {plans.map(plan => {
          const stat = stats.find(s => s.planId === plan.id)
          return (
            <Link
              key={plan.id}
              to={`/plans/${plan.id}`}
              className="flex justify-between p-4 hover:bg-secondary/30"
            >
              <span>{plan.title}</span>
              <span className="text-sm text-muted-foreground">{stat?.totalSwitches ?? 0}회</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
