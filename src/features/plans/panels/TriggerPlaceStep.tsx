import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Candidate } from '@/types/plan'

type PlaceTab = 'candidates' | 'recommend'

interface TriggerPlaceStepProps {
  placeTab: PlaceTab
  setPlaceTab: (tab: PlaceTab) => void
  candidates: Candidate[]
  representativeCandidateId: number | null
  busy: boolean
  onSwitchPlace: (toCandidateId: number) => Promise<void>
  recommendedPlaces: Array<{
    externalId: string
    name: string
    address: string
    latitude: number
    longitude: number
    isIndoor: boolean
    distanceMeters: number
    reason: string
  }>
  isAiLoading: boolean
  onRecommendClick: () => void
}

export default function TriggerPlaceStep({
  placeTab,
  setPlaceTab,
  candidates,
  representativeCandidateId,
  busy,
  onSwitchPlace,
  recommendedPlaces,
  isAiLoading,
  onRecommendClick,
}: TriggerPlaceStepProps) {
  return (
    <div>
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

      {placeTab === 'recommend' && (
        <div className="space-y-3">
          <button
            onClick={onRecommendClick}
            disabled={isAiLoading}
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'h-12 rounded-lg text-sm font-medium',
              'bg-primary/10 text-primary border border-primary/20',
              'hover:bg-primary/20 transition-colors disabled:opacity-60',
            )}
          >
            <Sparkles className="h-4 w-4" />
            {isAiLoading ? '추천 중...' : 'AI 추천받기'}
          </button>

          {isAiLoading && <p className="text-sm">불러오는 중...</p>}

          {!isAiLoading && recommendedPlaces.length === 0 && (
            <p className="text-sm text-muted-foreground">
              AI 추천 버튼을 눌러 추천 장소를 받아오세요.
            </p>
          )}

          {recommendedPlaces.map(place => (
            <div
              key={`${place.externalId}-${place.name}`}
              className="rounded-lg border border-border/50 p-3"
            >
              <div>
                <p className="text-sm font-medium">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.address}</p>
                <p className="text-xs text-muted-foreground">
                  거리 {place.distanceMeters.toLocaleString()}m
                </p>
                <p className="text-xs text-primary">{place.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
