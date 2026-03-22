import { MapPin, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/plan'

interface PlaceItemProps {
  place: Place
  isRepresentative: boolean
  onSelect: () => void
  onDelete: () => void
  canDelete: boolean
}

export default function PlaceItem({
  place,
  isRepresentative,
  onSelect,
  onDelete,
  canDelete,
}: PlaceItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'cursor-pointer rounded-xl border p-4 transition-colors',
        isRepresentative
          ? 'border-primary/30 bg-primary/10'
          : 'border-border/50 bg-background/40 hover:bg-secondary/100',
      )}
    >
      <div className="flex gap-3">
        {/* 정보 */}
        <div className="min-w-0 flex flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold">{place.name}</h4>

                {isRepresentative && (
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
              </div>
            </div>
            {canDelete ? (
              <button
                type="button"
                aria-label={`${place.name} 삭제`}
                onClick={e => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="마지막 후보는 삭제할 수 없습니다. 카테고리를 삭제해주세요."
                className="p-1 rounded-md opacity-40 cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{place.location}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-3 text-xs">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-medium',
                place.isIndoor ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400',
              )}
            >
              {place.isIndoor ? '실내' : '실외'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
