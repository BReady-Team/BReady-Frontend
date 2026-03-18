import { useEffect, useState } from 'react'
import type { PlanSummaryDTO } from '../types'
import { fetchPlanSummaries } from '../api'
import { PlanCard } from '../components/PlanCard'
import { NewPlanButton } from '../components/NewPlanButton'
import { useAuthStore } from '@/stores/authStore'

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const pages: (number | 'ellipsis')[] = []

  pages.push(0)

  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages - 2, currentPage + 1)

  if (start > 1) pages.push('ellipsis')

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages - 2) pages.push('ellipsis')

  pages.push(totalPages - 1)

  return pages
}

export default function PlanListPage() {
  const [plans, setPlans] = useState<PlanSummaryDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)

  const [pageInfo, setPageInfo] = useState<{
    page: number
    size: number
    totalElements: number
    totalPages: number
  } | null>(null)

  const accessToken = useAuthStore(state => state.accessToken)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!accessToken) {
          window.location.href = '/login'
          return
        }

        const data = await fetchPlanSummaries(page, 10)
        if (cancelled) return

        console.log('plans response =', data)

        setPlans(data.items ?? [])
        setPageInfo(data.pageInfo)
      } catch (e: unknown) {
        if (cancelled) return

        if (
          typeof e === 'object' &&
          e !== null &&
          'response' in e &&
          (e as { response?: { status: number } }).response?.status === 401
        ) {
          window.location.href = '/login'
          return
        }
        setError('플랜 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [accessToken, page])

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Plans</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? '…' : `${pageInfo?.totalElements ?? plans.length} plans`}
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

      {/* 페이지네이션 */}
      {pageInfo && pageInfo.totalPages > 1 && (
        <footer className="flex items-center justify-center gap-2 pt-6">
          {/* 처음 페이지 */}
          <button
            type="button"
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="cursor-pointer rounded-md border border-border/50 px-3 py-2 text-sm disabled:opacity-40"
          >
            &lt;&lt;
          </button>

          {/* 페이지 번호 */}
          {getPageItems(page, pageInfo.totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setPage(item)}
                className={
                  item === page
                    ? 'cursor-pointer px-3 py-2 text-sm font-medium text-primary'
                    : 'cursor-pointer px-3 py-2 text-sm hover:bg-secondary'
                }
              >
                {item + 1}
              </button>
            ),
          )}

          {/* 마지막 페이지 */}
          <button
            type="button"
            onClick={() => setPage(pageInfo.totalPages - 1)}
            disabled={page === pageInfo.totalPages - 1}
            className="cursor-pointer rounded-md border border-border/50 px-3 py-2 text-sm disabled:opacity-40"
          >
            &gt;&gt;
          </button>
        </footer>
      )}
    </main>
  )
}
