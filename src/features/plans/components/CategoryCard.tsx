import { ChevronDown, GripVertical, Plus, Zap, Trash2 } from 'lucide-react'
import type { Category } from '@/types/plan'
import PlaceItem from './PlaceItem'
import { cn } from '@/lib/utils'
import { categoryMeta } from '../constants/categoryMeta'

interface CategoryCardProps {
  category: Category
  isExpanded: boolean
  isDragging?: boolean
  onToggle: () => void
  onSelectRepresentative: (candidateId: number) => void
  onTrigger: () => void
  onSearch: () => void
  onDelete: () => void
  onDeleteCandidate: (candidateId: number) => void
}

export default function CategoryCard({
  category,
  isExpanded,
  isDragging,
  onToggle,
  onSelectRepresentative,
  onTrigger,
  onSearch,
  onDelete,
  onDeleteCandidate,
}: CategoryCardProps) {
  const { type, representativeCandidateId, candidates } = category
  const { label, Icon } = categoryMeta[type]
  const representativeCandidate = candidates.find(c => c.id === representativeCandidateId) ?? null

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card/90 shadow-[0_0_0_1px_rgba(255,255,255,0.2)] transition-all',
        isExpanded && 'border-primary/40 ring-2 ring-primary/20 shadow-lg',
        isDragging && 'scale-[0.98] opacity-50',
      )}
    >
      {/* 카테고리 헤더 */}
      <div
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors',
          isExpanded ? 'bg-primary/5' : 'hover:bg-secondary/30',
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <span className="font-medium">{label}</span>
          <span className="ml-2 text-sm text-muted-foreground">후보 {candidates.length}개</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`${label} 카테고리 삭제`}
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <ChevronDown
            className={cn(
              'h-5 w-5 transition-all',
              isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground',
            )}
          />
        </div>
      </div>

      {/* 대표 장소 */}
      <div className="border-t border-border/40 bg-background/40 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">대표 장소</p>
        </div>
        {representativeCandidate ? (
          <PlaceItem
            place={representativeCandidate.place}
            isRepresentative
            onSelect={() => {}}
            onDelete={() => onDeleteCandidate(representativeCandidate.id)}
            canDelete={candidates.length > 1}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 bg-background/30 px-4 py-6 text-center text-sm text-muted-foreground">
            대표 장소가 없습니다.
          </div>
        )}

        <div className="mt-4">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onTrigger()
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
          >
            <Zap className="h-4 w-4" />
            트리거 발생
          </button>
        </div>
      </div>

      {/* 후보 장소 목록 */}
      {isExpanded && (
        <div className="border-t border-border/60 bg-secondary/15 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">후보 장소</p>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onSearch()
              }}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              장소 추가
            </button>
          </div>

          {candidates.length > 0 ? (
            <div className="space-y-3">
              {candidates.map(candidate => (
                <PlaceItem
                  key={candidate.id}
                  place={candidate.place}
                  isRepresentative={candidate.id === representativeCandidateId}
                  onSelect={() => onSelectRepresentative(candidate.id)}
                  onDelete={() => onDeleteCandidate(candidate.id)}
                  canDelete={candidates.length > 1}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">후보 장소가 없습니다</p>
          )}
        </div>
      )}
    </div>
  )
}
