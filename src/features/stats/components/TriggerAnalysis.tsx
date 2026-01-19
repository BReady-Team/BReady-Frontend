import type { PlanStats } from '../types/statsTypes'
import { triggerLabels } from '@/features/plans/mock/mockPlans'
import { CloudRain, Clock, XCircle, Battery, MapPin, Activity } from 'lucide-react'
import type { TriggerType } from '@/types/plan'

const triggerIcons: Record<TriggerType, React.ElementType> = {
  WEATHER_BAD: CloudRain,
  WAITING_LONG: Clock,
  CLOSED: XCircle,
  FATIGUE: Battery,
  DISTANCE_FAR: MapPin,
}

export default function TriggerAnalysis({ stats }: { stats: PlanStats[] }) {
  const counts = stats.reduce<Record<TriggerType, number>>(
    (acc, s) => {
      Object.entries(s.triggerCounts).forEach(([k, v]) => {
        acc[k as TriggerType] = (acc[k as TriggerType] ?? 0) + v
      })
      return acc
    },
    {} as Record<TriggerType, number>,
  )

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="lg:col-span-3 rounded-2xl border border-border/50 bg-card">
      <div className="border-b p-6">
        <h2 className="font-medium">트리거 분석</h2>
        <p className="text-sm text-muted-foreground">상황별 발생 빈도</p>
      </div>

      <div className="p-6 space-y-4">
        {entries.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Activity className="mx-auto mb-2" />
            기록이 없습니다
          </div>
        )}

        {entries.map(([type, count], idx) => {
          const Icon = triggerIcons[type as TriggerType]
          return (
            <div key={type}>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4" />
                  {triggerLabels[type as TriggerType]}
                  {idx === 0 && count > 0 && (
                    <span className="ml-1 rounded bg-primary/10 px-1 text-[10px] text-primary">
                      TOP
                    </span>
                  )}
                </span>
                <span className="text-sm">{count}회</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
