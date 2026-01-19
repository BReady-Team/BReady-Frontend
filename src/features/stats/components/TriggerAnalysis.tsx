import type { PlanStats } from '../types/statsTypes'
import type { TriggerType } from '@/types/plan'
import { triggerLabels } from '@/features/plans/mock/mockPlans'
import { triggerUiMap } from '../constants/triggerUi'
import { Activity } from 'lucide-react'

interface Props {
  stats: PlanStats[]
}

export default function TriggerAnalysis({ stats }: Props) {
  /* 트리거 집계 */
  const counts = stats.reduce<Record<TriggerType, number>>(
    (acc, stat) => {
      Object.entries(stat.triggerCounts).forEach(([key, value]) => {
        acc[key as TriggerType] = (acc[key as TriggerType] ?? 0) + value
      })
      return acc
    },
    {} as Record<TriggerType, number>,
  )

  const entries = (Object.keys(triggerLabels) as TriggerType[])
    .map(type => ({
      type,
      count: counts[type] ?? 0,
    }))
    .sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...entries.map(e => e.count), 1)
  const totalCount = entries.reduce((acc, e) => acc + e.count, 0)

  return (
    <div className="lg:col-span-3 rounded-2xl border border-border/50 bg-card">
      <div className="border-b border-border/30 p-6">
        <h2 className="font-medium">트리거 분석</h2>
        <p className="mt-1 text-sm text-muted-foreground">상황별 발생 빈도</p>
      </div>

      <div className="p-6 space-y-5">
        {totalCount === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <Activity className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">아직 트리거 기록이 없습니다</p>
          </div>
        )}

        {entries.map((entry, index) => {
          const { Icon, className } = triggerUiMap[entry.type]
          const percentage = totalCount > 0 ? Math.round((entry.count / totalCount) * 100) : 0

          return (
            <div key={entry.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${className}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{triggerLabels[entry.type]}</span>

                    {index === 0 && entry.count > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        TOP
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-medium">{entry.count}회</span>
                  <span className="ml-2 text-xs text-muted-foreground">{percentage}%</span>
                </div>
              </div>

              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(entry.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
