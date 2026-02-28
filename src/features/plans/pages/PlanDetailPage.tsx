import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'

import CategoryCard from '../components/CategoryCard'
import AddCategoryButton from '../components/AddCategoryButton'
import SearchPanel from '../panels/SearchPanel'
import TriggerPanel from '../panels/TriggerPanel'
import { formatKoreanDate } from '@/lib/date'

import { setRepresentative } from '@/lib/api/place'
import { createTrigger, createDecision, executeSwitch } from '@/lib/api/trigger'
import { deletePlan, deletePlanCategory, deleteCandidate } from '../api'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Place, Category, CategoryType, TriggerType, Candidate } from '@/types/plan'
import { createCategory } from '@/lib/api/category'
import { useEffect } from 'react'
import { fetchPlanDetail } from '../api'
import type { Plan } from '@/types/plan'

export default function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>()
  const numericPlanId = Number(planId)

  const navigate = useNavigate()

  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
  const [activePanel, setActivePanel] = useState<'none' | 'search' | 'trigger'>('none')
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [triggerId, setTriggerId] = useState<number | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const [categoryDeleting, setCategoryDeleting] = useState(false)

  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null)
  const [candidateDeleting, setCandidateDeleting] = useState(false)

  const activeCategory = categories.find(c => c.id === activeCategoryId) ?? null

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetchPlanDetail(numericPlanId)

        setPlan({
          id: res.plan.planId,
          title: res.plan.title,
          date: res.plan.planDate,
          region: res.plan.region,
          categories: [],
          createdAt: '',
          updatedAt: '',
        })

        setCategories(res.categories)
      } catch (e) {
        console.error(e)
        alert('플랜 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [numericPlanId])
  if (loading || !plan) {
    return <div className="p-10">불러오는 중...</div>
  }

  const toggleCategory = (id: number) => {
    setExpandedCategoryId(prev => (prev === id ? null : id))
  }

  const openSearchPanel = (categoryId: number) => {
    setActiveCategoryId(categoryId)
    setActivePanel('search')
  }

  const openTriggerPanel = (categoryId: number) => {
    setActiveCategoryId(categoryId)
    setTriggerId(null) // 패널 열 때마다 초기화
    setActivePanel('trigger')
  }

  const closePanel = () => {
    setActivePanel('none')
    setActiveCategoryId(null)
  }

  const handleSelectRepresentative = async (categoryId: number, candidateId: number) => {
    try {
      // 서버 API가 placeId를 요구한다면 여기서 placeId를 추출해서 호출
      const targetCategory = categories.find(c => c.id === categoryId)
      const targetCandidate = targetCategory?.candidates.find(c => c.id === candidateId)

      if (!targetCandidate) return

      await setRepresentative(candidateId)

      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== categoryId) return cat

          return {
            ...cat,
            representativeCandidateId: candidateId,
            candidates: cat.candidates.map(c => ({
              ...c,
              isRepresentative: c.id === candidateId,
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
    const tempCandidate: Candidate = {
      id: place.id,
      place,
      isRepresentative: false,
    }

    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, candidates: [...cat.candidates, tempCandidate] } : cat,
      ),
    )
  }

  const handleAddCategory = async (type: CategoryType) => {
    if (!plan) return

    try {
      const res = await createCategory(plan.id, type)

      setCategories(prev => [
        ...prev,
        {
          id: res.planCategoryId,
          type,
          order: res.sequence,
          representativeCandidateId: 0,
          candidates: [],
        },
      ])
    } catch {
      alert('카테고리 생성 실패')
    }
  }

  const handleChangeCategory = (newType: CategoryType) => {
    if (!activeCategoryId) return

    setCategories(prev =>
      prev.map(cat => (cat.id === activeCategoryId ? { ...cat, type: newType } : cat)),
    )
  }

  // 트리거 발생
  const handleTrigger = async (triggerType: TriggerType) => {
    if (!activeCategory?.id) {
      console.error('activeCategory 없음', activeCategory)
      return
    }

    if (!plan?.id) {
      console.error('plan 없음', plan)
      return
    }

    console.log('Trigger request = ', {
      planId: plan.id,
      categoryId: activeCategory.id,
      triggerType,
    })

    const res = await createTrigger(plan.id, activeCategory.id, triggerType)

    setTriggerId(res.triggerId)
  }
  // KEEP 결정
  const handleKeep = async () => {
    if (!triggerId) {
      alert('트리거가 먼저 생성되어야 합니다. (트리거 선택을 다시 해주세요)')
      return
    }

    await createDecision(triggerId, 'KEEP')
    closePanel()
  }

  // SWITCH 확정
  const handleSwitchPlace = async (toCandidateId: number) => {
    if (!activeCategory) return

    if (!triggerId) {
      alert('트리거가 먼저 생성되어야 합니다. (트리거 선택을 다시 해주세요)')
      return
    }

    // SWITCH 결정 생성
    const decisionRes = await createDecision(triggerId, 'SWITCH')

    // 실제 대표 후보 변경 확정
    await executeSwitch(decisionRes.decisionId, toCandidateId)

    // UI 대표 후보 변경 (서버에서 대표 바꿨으니 프론트도 동기화)
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== activeCategory.id) return cat

        return {
          ...cat,
          representativeCandidateId: toCandidateId,
          candidates: cat.candidates.map(p => ({
            ...p,
            isRepresentative: p.id === toCandidateId,
          })),
        }
      }),
    )

    closePanel()
  }

  return (
    <div className="relative min-h-screen">
      <div
        className={`mx-auto max-w-3xl px-6 py-12 transition-all ${
          activePanel !== 'none' ? 'mr-[420px]' : ''
        }`}
      >
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
                      navigate(`/plans/${plan.id}/edit`)
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
                      setDeleteOpen(true)
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="space-y-4">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategoryId === category.id}
              onToggle={() => toggleCategory(category.id)}
              onSelectRepresentative={candidateId =>
                handleSelectRepresentative(category.id, candidateId)
              }
              onSearch={() => openSearchPanel(category.id)}
              onTrigger={() => {
                console.log('trigger category.id =', category.id)
                openTriggerPanel(category.id)
              }}
              onDelete={() => setDeleteCategoryId(category.id)}
              onDeleteCandidate={candidateId => {
                const targetCategory = categories.find(cat =>
                  cat.candidates.some(c => c.id === candidateId),
                )
                if (!targetCategory) return

                if (targetCategory.candidates.length <= 1) {
                  alert('마지막 후보는 삭제할 수 없습니다. 카테고리를 삭제해주세요.')
                  return
                }

                setDeleteCandidateId(candidateId)
              }}
            />
          ))}

          <AddCategoryButton onAdd={handleAddCategory} />
        </div>
      </div>

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
          representativeCandidateId={activeCategory.representativeCandidateId}
          onClose={closePanel}
          onTrigger={handleTrigger}
          onKeep={handleKeep}
          onSwitchPlace={handleSwitchPlace}
          onChangeCategory={handleChangeCategory}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="플랜을 삭제할까요?"
        description="삭제하면 복구할 수 없습니다."
        confirmText={deleting ? '삭제 중...' : '삭제'}
        cancelText="취소"
        destructive
        onClose={() => {
          if (!deleting) setDeleteOpen(false)
        }}
        onConfirm={async () => {
          try {
            setDeleting(true)
            await deletePlan(plan.id)
            navigate('/plans')
            return
          } catch {
            alert('삭제에 실패했습니다.')
          } finally {
            setDeleting(false)
            setDeleteOpen(false)
          }
        }}
      />

      <ConfirmDialog
        open={deleteCategoryId !== null}
        title="카테고리를 삭제할까요?"
        description="해당 카테고리와 후보 장소가 모두 삭제됩니다."
        confirmText={categoryDeleting ? '삭제 중...' : '삭제'}
        cancelText="취소"
        destructive
        onClose={() => {
          if (!categoryDeleting) setDeleteCategoryId(null)
        }}
        onConfirm={async () => {
          if (deleteCategoryId === null) return

          try {
            setCategoryDeleting(true)

            await deletePlanCategory(plan.id, deleteCategoryId)

            setCategories(prev => prev.filter(cat => cat.id !== deleteCategoryId))
          } catch {
            alert('카테고리 삭제에 실패했습니다.')
          } finally {
            setCategoryDeleting(false)
            setDeleteCategoryId(null)
          }
        }}
      />

      <ConfirmDialog
        open={deleteCandidateId !== null}
        title="후보 장소를 삭제할까요?"
        description="대표 장소인 경우 다음 후보가 자동으로 대표가 됩니다."
        confirmText={candidateDeleting ? '삭제 중...' : '삭제'}
        cancelText="취소"
        destructive
        onClose={() => {
          if (!candidateDeleting) setDeleteCandidateId(null)
        }}
        onConfirm={async () => {
          if (deleteCandidateId === null) return

          try {
            setCandidateDeleting(true)

            await deleteCandidate(deleteCandidateId)

            setCategories(prev =>
              prev.map(cat => {
                const filtered = cat.candidates.filter(p => p.id !== deleteCandidateId)

                if (filtered.length === 0) {
                  alert('마지막 후보는 삭제할 수 없습니다.')
                  return cat
                }

                const wasRepresentative = cat.representativeCandidateId === deleteCandidateId

                return {
                  ...cat,
                  candidates: filtered,
                  representativeCandidateId: wasRepresentative
                    ? filtered[0].id
                    : cat.representativeCandidateId,
                }
              }),
            )
          } catch {
            alert('후보 삭제에 실패했습니다.')
          } finally {
            setCandidateDeleting(false)
            setDeleteCandidateId(null)
          }
        }}
      />
    </div>
  )
}
