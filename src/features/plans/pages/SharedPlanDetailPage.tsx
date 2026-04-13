import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import { formatKoreanDate } from '@/lib/date'
import { fetchSharedPlanDetail } from '../api'
import type { Category } from '@/types/plan'
import CategoryCard from '../components/CategoryCard'

type SharedPlan = {
  id: number
  title: string
  date: string
  region: string
  ownerNickname: string
  ownerProfileImageUrl: string | null
}

export default function SharedPlanDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>()

  const [plan, setPlan] = useState<SharedPlan | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!shareToken) {
        setError('잘못된 접근입니다.')
        setLoading(false)
        return
      }

      try {
        const data = await fetchSharedPlanDetail(shareToken)

        setPlan({
          id: data.plan.planId,
          title: data.plan.title,
          date: data.plan.planDate,
          region: data.plan.region,
          ownerNickname: data.plan.ownerNickname,
          ownerProfileImageUrl: data.plan.ownerProfileImageUrl,
        })

        setCategories(data.categories)
      } catch (e) {
        console.error(e)
        setError('공유된 플랜 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [shareToken])

  if (loading) return <div className="p-10">불러오는 중...</div>
  if (error || !plan) return <div className="p-10">{error ?? '잘못된 접근입니다.'}</div>

  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-primary/10 via-background to-secondary/40 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {plan.ownerProfileImageUrl ? (
                  <img
                    src={plan.ownerProfileImageUrl}
                    alt={`${plan.ownerNickname} 프로필 이미지`}
                    className="h-16 w-16 shrink-0 rounded-full border border-white/70 object-cover shadow-md sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
                    <User className="h-8 w-8 text-primary/60 sm:h-10 sm:w-10" aria-hidden="true" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{plan.ownerNickname}</span>
                    <span className="ml-1">님의 플랜입니다</span>
                  </p>
                  <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                    {plan.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatKoreanDate(plan.date)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {plan.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategoryId === category.id}
              isDragging={false}
              dragHandleProps={undefined}
              onToggle={() =>
                setExpandedCategoryId(prev => (prev === category.id ? null : category.id))
              }
              onSelectRepresentative={() => {}}
              onSearch={() => {}}
              onTrigger={() => {}}
              onDelete={() => {}}
              onDeleteCandidate={() => {}}
              readOnly
            />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 to-background p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">이 플랜이 마음에 드셨나요?</p>

          <p className="mt-2 text-base font-medium text-foreground">
            로그인하고 나만의 플랜을 만들어보세요
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <a
              href="/login"
              className="rounded-xl border border-border px-5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-secondary"
            >
              로그인
            </a>

            <a
              href="/signup"
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:opacity-90"
            >
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
