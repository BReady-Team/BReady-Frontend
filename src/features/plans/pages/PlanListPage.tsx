import { useEffect, useState } from 'react'
import type { PlanSummaryDTO } from '../types'
import { fetchPlanSummaries } from '../api'
import { PlanCard } from '../components/PlanCard'
import { NewPlanButton } from '../components/NewPlanButton'

export default function PlanListPage() {
  const [plans, setPlans] = useState<PlanSummaryDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchPlanSummaries()
        if (cancelled) return

        console.log('plans response =', data)

        setPlans(data.items ?? [])
      } catch {
        if (cancelled) return
        setError('플랜 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
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
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          plans.map(plan => <PlanCard key={plan.id} plan={plan} />)
        )}
      </section>
    </main>
  )
}
