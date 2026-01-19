import { Calendar, RefreshCw, BarChart3, Clock } from 'lucide-react'

interface Props {
  totalPlans: number
  totalSwitches: number
  avgSwitchesPerPlan: string
  recentCount: number
}

export default function StatsSummaryCard({
  totalPlans,
  totalSwitches,
  avgSwitchesPerPlan,
  recentCount,
}: Props) {
  const cards = [
    { label: '총 플랜', value: totalPlans, icon: Calendar },
    { label: '총 전환 횟수', value: totalSwitches, icon: RefreshCw },
    { label: '플랜당 평균 전환', value: avgSwitchesPerPlan, icon: BarChart3 },
    { label: '최근 기록', value: recentCount, icon: Clock },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}
