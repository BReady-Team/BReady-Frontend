import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'

import { mockPlans } from '../mock/mockPlans'
import type { Category, CategoryType } from '@/types/plan'

import CategoryCard from '../components/CategoryCard'
import AddCategoryButton from '../components/AddCategoryButton'
import SearchPanel from '../panels/SearchPanel'
import TriggerPanel from '../panels/TriggerPanel'

export default function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>()
  const plan = mockPlans.find(p => p.id === planId) ?? mockPlans[0]
  const [categories, setCategories] = useState<Category[]>(plan.categories)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'none' | 'search' | 'trigger'>('none')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  const activeCategory = categories.find(c => c.id === activeCategoryId)
  const toggleCategory = (id: string) => {
    setExpandedCategoryId(prev => (prev === id ? null : id))
  }

  const openSearchPanel = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    setActivePanel('search')
  }

  const openTriggerPanel = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    setActivePanel('trigger')
  }

  const closePanel = () => {
    setActivePanel('none')
    setActiveCategoryId(null)
  }

  const handleSelectRepresentative = (categoryId: string, placeId: string) => {
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
  }

  const handleAddPlace = (categoryId: string, place: any) => {
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

  const handleChangePlace = (placeId: string) => {
    if (!activeCategoryId) return
    handleSelectRepresentative(activeCategoryId, placeId)
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
        <header className="mb-10">
          <h1 className="text-2xl font-semibold">{plan.title}</h1>
          <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {plan.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {plan.region}
            </span>
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
