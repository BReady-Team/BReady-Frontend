import { useEffect, useState } from 'react'
import type { PlanSummaryDTO } from '../types'
import { fetchPlanSummaries } from '../api'
import { PlanCard } from '../components/PlanCard'
import { NewPlanButton } from '../components/NewPlanButton'

export default function PlanListPage() {
  const [plans, setPlans] = useState<PlanSummaryDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlanSummaries().then(data => {
      setPlans(data)
      setLoading(false)
    })
  }, [])

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Plans</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? '…' : `${plans.length} plans`}
          </p>
        </div>
        <NewPlanButton />
      </header>

      <section className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">불러오는 중...</div>
        ) : (
          plans.map(plan => <PlanCard key={plan.id} plan={plan} />)
        )}
      </section>
    </main>
  )
}
