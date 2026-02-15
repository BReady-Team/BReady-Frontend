import { MapPin, Star, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/plan'

interface PlaceItemProps {
  place: Place
  isRepresentative: boolean
  onSelect: () => void
  onDelete: () => void
}

export default function PlaceItem({ place, isRepresentative, onSelect, onDelete }: PlaceItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex gap-4 rounded-lg p-2 cursor-pointer transition-colors',
        isRepresentative ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-secondary/50',
      )}
    >
      {/* 썸네일 */}
      <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
        <img
          src={place.thumbnailUrl ?? '/seoul_forest.jpg'}
          alt={place.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{place.name}</h4>

            {isRepresentative && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {place.location}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            {place.rating}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px]',
              place.isIndoor ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400',
            )}
          >
            {place.isIndoor ? '실내' : '실외'}
          </span>
        </div>
      </div>
    </div>
  )
}
