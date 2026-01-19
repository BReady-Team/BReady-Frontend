import type { SwitchLog } from '../types/statsTypes'
import { mockPlans } from '@/features/plans/mock/mockPlans'
import { triggerUiMap } from '../constants/triggerUi'
import { BarChart3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  logs: SwitchLog[]
}

export default function RecentActivity({ logs }: Props) {
  const recentLogs = logs.slice(0, 5)

  return (
    <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card">
      <div className="border-b border-border/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">최근 활동</h2>
            <p className="mt-1 text-sm text-muted-foreground">전환 기록</p>
          </div>

          <Link
            to="/plans"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            전체 보기
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {recentLogs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <BarChart3 className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">아직 기록이 없습니다</p>
          </div>
        )}

        {recentLogs.map(log => {
          const plan = mockPlans.find(p => p.id === log.planId)
          const { Icon, className } = triggerUiMap[log.triggerType]

          return (
            <div key={log.id} className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{plan?.title ?? '알 수 없는 플랜'}</p>
                <p className="text-xs text-muted-foreground">
                  {log.decision === 'KEEP' ? '그대로 진행' : '장소 변경'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  {new Date(log.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
