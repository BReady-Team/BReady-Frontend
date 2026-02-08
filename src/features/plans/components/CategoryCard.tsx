import { ChevronDown, GripVertical, Plus, Zap } from 'lucide-react'
import type { Category } from '@/types/plan'
import PlaceItem from './PlaceItem'
import { cn } from '@/lib/utils'
import { categoryMeta } from '../constants/categoryMeta'

interface CategoryCardProps {
  category: Category
  isExpanded: boolean
  isDragging?: boolean
  onToggle: () => void
  onSelectRepresentative: (placeId: number) => void
  onTrigger: () => void
  onSearch: () => void
}

export default function CategoryCard({
  category,
  isExpanded,
  isDragging,
  onToggle,
  onSelectRepresentative,
  onTrigger,
  onSearch,
}: CategoryCardProps) {
  const { type, representativePlace, candidates } = category
  const { label, Icon } = categoryMeta[type]
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-card transition-all',
        isExpanded && 'ring-1 ring-primary/20',
        isDragging && 'opacity-50 scale-[0.98]',
      )}
    >
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex h-8 w-8 items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <span className="font-medium">{label}</span>
          <span className="ml-2 text-xs text-muted-foreground">후보 {candidates.length}개</span>
        </div>

        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180',
          )}
        />
      </div>

      {/* 대표 장소 */}
      <div className="border-t border-border/30 p-4">
        <PlaceItem place={representativePlace} isRepresentative onSelect={() => {}} />

        <div className="mt-4">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onTrigger()
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Zap className="h-4 w-4" />
            트리거 발생
          </button>
        </div>
      </div>

      {/* 후보 장소 목록 */}
      {isExpanded && (
        <div className="border-t border-border/30 p-4 space-y-3 bg-secondary/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">후보 장소</p>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onSearch()
              }}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              장소 추가
            </button>
          </div>

          {candidates.length > 0 ? (
            candidates.map(place => (
              <PlaceItem
                key={place.id}
                place={place}
                isRepresentative={place.id === representativePlace.id}
                onSelect={() => onSelectRepresentative(place.id)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">후보 장소가 없습니다</p>
          )}
        </div>
      )}
    </div>
  )
}
