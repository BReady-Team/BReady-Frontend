import { cn } from '@/lib/utils'
import type { Candidate } from '@/types/plan'

type PlaceTab = 'candidates' | 'recommend'

const mockSearchResults: any[] = []

interface TriggerPlaceStepProps {
  placeTab: PlaceTab
  setPlaceTab: (tab: PlaceTab) => void
  candidates: Candidate[]
  representativeCandidateId: number | null
  busy: boolean
  onSwitchPlace: (toCandidateId: number) => Promise<void>
  onRecommendClick: () => void
}

export default function TriggerPlaceStep({
  placeTab,
  setPlaceTab,
  candidates,
  representativeCandidateId,
  busy,
  onSwitchPlace,
  onRecommendClick,
}: TriggerPlaceStepProps) {
  return (
    <>
      <div className="flex gap-1 rounded-lg bg-secondary/50 p-1">
        {(['candidates', 'recommend'] as PlaceTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setPlaceTab(tab)}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-xs font-medium',
              placeTab === tab ? 'bg-background shadow' : 'text-muted-foreground',
            )}
          >
            {tab === 'candidates' ? '후보 장소' : '추천'}
          </button>
        ))}
      </div>

      {placeTab === 'candidates' &&
        candidates
          .filter(c => c.id !== representativeCandidateId)
          .map(candidate => {
            const place = candidate.place

            return (
              <button
                key={candidate.id}
                disabled={busy}
                onClick={() => onSwitchPlace(candidate.id)}
                className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-secondary/50 disabled:opacity-60"
              >
                <img
                  src={place.thumbnailUrl ?? '/seoul_forest.jpg'}
                  className="h-12 w-16 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.location}</p>
                </div>
              </button>
            )
          })}

      {placeTab === 'recommend' &&
        mockSearchResults.map(place => (
          <button
            key={place.id}
            disabled={busy}
            onClick={onRecommendClick}
            className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-secondary/50 disabled:opacity-60"
          >
            <img
              src={place.thumbnailUrl ?? '/seoul_forest.jpg'}
              className="h-12 w-16 rounded-md object-cover"
            />
            <div>
              <p className="text-sm font-medium">{place.name}</p>
              <p className="text-xs text-muted-foreground">{place.location}</p>
            </div>
          </button>
        ))}
    </>
  )
}
