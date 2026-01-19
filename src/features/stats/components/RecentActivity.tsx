import type { SwitchLog } from '../types/statsTypes'
import { mockPlans } from '@/features/plans/mock/mockPlans'
import { triggerLabels } from '@/features/plans/mock/mockPlans'

export default function RecentActivity({ logs }: { logs: SwitchLog[] }) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card">
      <div className="border-b p-6">
        <h2 className="font-medium">최근 활동</h2>
        <p className="text-sm text-muted-foreground">전환 기록</p>
      </div>

      <div className="divide-y">
        {logs.slice(0, 5).map(log => {
          const plan = mockPlans.find(p => p.id === log.planId)
          return (
            <div key={log.id} className="p-4">
              <p className="text-sm font-medium">{plan?.title}</p>
              <p className="text-xs text-muted-foreground">
                {triggerLabels[log.triggerType]} · {new Date(log.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
