import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { formatKoreanDate } from '@/lib/date'
import { fetchSharedPlanDetail } from '../api'
import type { Category } from '@/types/plan'
import CategoryCard from '../components/CategoryCard'

type SharedPlan = {
  id: number
  title: string
  date: string
  region: string
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
        })

        setCategories(
          (data.categories ?? []).map(
            (c: {
              planCategoryId: number
              categoryType: string
              sequence: number
              representativeCandidateId: number
              candidates?: Array<{
                candidateId: number
                isRepresentative?: boolean
                place: {
                  id: number
                  externalId: string
                  name: string
                  address: string
                  latitude: number
                  longitude: number
                  isIndoor?: boolean
                }
              }>
            }) => ({
              id: c.planCategoryId,
              type: c.categoryType,
              order: c.sequence,
              representativeCandidateId: c.representativeCandidateId,
              candidates: (c.candidates ?? []).map(cd => ({
                id: cd.candidateId,
                isRepresentative: cd.isRepresentative ?? false,
                place: {
                  id: cd.place.id,
                  externalId: cd.place.externalId,
                  name: cd.place.name,
                  location: cd.place.address,
                  latitude: cd.place.latitude,
                  longitude: cd.place.longitude,
                  rating: 0,
                  isIndoor: cd.place.isIndoor ?? false,
                },
              })),
            }),
          ),
        )
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
        <header className="mb-8">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold tracking-tight">{plan.title}</h1>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatKoreanDate(plan.date)}
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {plan.region}
              </span>
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
      </div>
    </div>
  )
}
