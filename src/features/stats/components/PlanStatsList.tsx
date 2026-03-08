import { Link } from 'react-router-dom'
import type { PlanStatsItem } from '../types/statsTypes'

interface Props {
  items: PlanStatsItem[]
}

export default function PlanStatsList({ items }: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-border/50 bg-card">
      <div className="border-b p-6">
        <h2 className="font-medium">플랜별 통계</h2>
        <p className="text-sm text-muted-foreground">각 플랜의 전환 기록</p>
      </div>

      <div className="divide-y">
        {items.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">표시할 플랜 통계가 없습니다.</div>
        )}

        {items.map(item => (
          <Link
            key={item.planId}
            to={`/plans/${item.planId}`}
            className="flex justify-between p-4 hover:bg-secondary/30"
          >
            <span>{item.planTitle}</span>
            <span className="text-sm text-muted-foreground">{item.totalSwitches}회</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
