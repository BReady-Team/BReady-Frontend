import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Calendar, MapPin } from 'lucide-react'

import type { Place, Category, CategoryType } from '@/types/plan'
import { mockPlans } from '../mock/mockPlans'

import CategoryCard from '../components/CategoryCard'
import AddCategoryButton from '../components/AddCategoryButton'
import SearchPanel from '../panels/SearchPanel'
import TriggerPanel from '../panels/TriggerPanel'
import { formatKoreanDate } from '@/lib/date'
import { setRepresentative } from '@/lib/api/place'

export default function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>()

  const numericPlanId = Number(planId)

  const plan = useMemo(
    () => mockPlans.find(p => p.id === numericPlanId) ?? mockPlans[0],
    [numericPlanId],
  )

  const [categories, setCategories] = useState<Category[]>(() => plan.categories)
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
  const [activePanel, setActivePanel] = useState<'none' | 'search' | 'trigger'>('none')
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isManageOpen, setIsManageOpen] = useState(false)

  const activeCategory = categories.find(c => c.id === activeCategoryId)

  const toggleCategory = (id: number) => {
    setExpandedCategoryId(prev => (prev === id ? null : id))
  }

  const openSearchPanel = (categoryId: number) => {
    setActiveCategoryId(categoryId)
    setActivePanel('search')
  }

  const openTriggerPanel = (categoryId: number) => {
    setActiveCategoryId(categoryId)
    setActivePanel('trigger')
  }

  const closePanel = () => {
    setActivePanel('none')
    setActiveCategoryId(null)
  }

  const handleSelectRepresentative = async (categoryId: number, placeId: number) => {
    try {
      // 서버 먼저 저장
      await setRepresentative(placeId)

      // 성공하면 UI 변경
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== categoryId) return cat

          const newRep = cat.candidates.find(p => p.id === placeId)
          if (!newRep) return cat

          return {
            ...cat,
            representativePlace: { ...newRep, isRepresentative: true },
            candidates: cat.candidates.map(p => ({
              ...p,
              isRepresentative: p.id === placeId,
            })),
          }
        }),
      )
    } catch (e) {
      console.error(e)
      alert('대표 장소 변경 실패')
    }
  }

  const handleAddPlace = (categoryId: number, place: Place) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, candidates: [...cat.candidates, place] } : cat,
      ),
    )
  }

  const handleChangeCategory = (newType: CategoryType) => {
    if (!activeCategoryId) return

    setCategories(prev =>
      prev.map(cat => (cat.id === activeCategoryId ? { ...cat, type: newType } : cat)),
    )
  }

  const handleChangePlace = (place: Place) => {
    if (!activeCategoryId) return

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== activeCategoryId) return cat

        const exists = cat.candidates.some(p => p.id === place.id)

        const updatedCandidates = exists ? cat.candidates : [...cat.candidates, place]

        return {
          ...cat,
          candidates: updatedCandidates.map(p => ({
            ...p,
            isRepresentative: p.id === place.id,
          })),
          representativePlace: { ...place, isRepresentative: true },
        }
      }),
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* 메인 콘텐츠 부분 */}
      <div
        className={`mx-auto max-w-3xl px-6 py-12 transition-all ${
          activePanel !== 'none' ? 'mr-[420px]' : ''
        }`}
      >
        {/* 헤더 */}
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{plan.title}</h1>

            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
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

          {/* 관리 버튼 */}
          <div className="relative">
            <button
              onClick={() => setIsManageOpen(prev => !prev)}
              className="rounded-md border border-border/50 px-3 py-1.5 text-sm hover:bg-secondary"
            >
              관리
            </button>

            {isManageOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsManageOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-36 rounded-md border border-border bg-background shadow-lg">
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                    onClick={() => {
                      setIsManageOpen(false)
                      console.log('수정')
                    }}
                  >
                    ✏️ 수정
                  </button>

                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                    onClick={() => {
                      setIsManageOpen(false)
                      console.log('공유')
                    }}
                  >
                    🔗 공유
                  </button>

                  <div className="my-1 h-px bg-border" />

                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setIsManageOpen(false)
                      console.log('삭제')
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* 카테고리 */}
        <div className="space-y-4">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategoryId === category.id}
              onToggle={() => toggleCategory(category.id)}
              onSelectRepresentative={placeId => handleSelectRepresentative(category.id, placeId)}
              onSearch={() => openSearchPanel(category.id)}
              onTrigger={() => openTriggerPanel(category.id)}
            />
          ))}

          <AddCategoryButton onAdd={type => console.log('add category', type)} />
        </div>
      </div>

      {/* 패널 */}
      {activePanel === 'search' && activeCategory && (
        <SearchPanel
          planId={plan.id}
          categoryId={activeCategory.id}
          categoryType={activeCategory.type}
          onClose={closePanel}
          onAddPlace={place => handleAddPlace(activeCategory.id, place)}
        />
      )}

      {activePanel === 'trigger' && activeCategory && (
        <TriggerPanel
          isOpen
          categoryType={activeCategory.type}
          candidates={activeCategory.candidates}
          representativePlaceId={activeCategory.representativePlace.id}
          onClose={closePanel}
          onKeep={closePanel}
          onChangeCategory={handleChangeCategory}
          onChangePlace={handleChangePlace}
        />
      )}
    </div>
  )
}
