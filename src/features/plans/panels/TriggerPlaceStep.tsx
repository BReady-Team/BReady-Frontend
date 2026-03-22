import { useMemo, useState } from 'react'
import { Sparkles, MapPin, Compass, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Candidate, Place } from '@/types/plan'
import { createCandidate, type CreateCandidateRequest } from '@/lib/api/place'
import { useKakaoMapLoader } from '@/lib/kakao/useKakaoMapLoader'
import PlaceMap, { type MapPlaceMarker } from '../components/PlaceMap'

type PlaceTab = 'candidates' | 'recommend'

interface TriggerPlaceStepProps {
  planId: number
  categoryId: number
  onAddPlace: (place: Place) => void
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
  planId,
  categoryId,
  onAddPlace,
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
  const [focusPlaceId, setFocusPlaceId] = useState<number | string | null>(null)
  const mapReady = useKakaoMapLoader(import.meta.env.VITE_KAKAO_MAP_APP_KEY)

  const markerPlaces: MapPlaceMarker[] = useMemo(
    () =>
      recommendedPlaces
        .filter(place => typeof place.latitude === 'number' && typeof place.longitude === 'number')
        .map(place => ({
          id: place.externalId ?? place.name,
          name: place.name,
          lat: place.latitude,
          lng: place.longitude,
        })),
    [recommendedPlaces],
  )

  const handleAdd = async (place: {
    externalId: string
    name: string
    address: string
    latitude: number
    longitude: number
    isIndoor: boolean
    distanceMeters: number
    reason: string
  }) => {
    const body: CreateCandidateRequest = {
      planId,
      categoryId,
      externalId: place.externalId,
      name: place.name,
      address: place.address,
      latitude: place.latitude || 0,
      longitude: place.longitude || 0,
      isIndoor: place.isIndoor,
    }

    const res = await createCandidate(body)

    const savedPlace: Place = {
      id: res.candidateId,
      externalId: res.place.externalId,
      name: res.place.name,
      location: res.place.address ?? '',
      latitude: place.latitude,
      longitude: place.longitude,
      rating: 0,
      isIndoor: res.place.isIndoor ?? false,
      isRepresentative: false,
    }

    onAddPlace(savedPlace)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 rounded-lg bg-secondary/50 p-1">
        {(['candidates', 'recommend'] as PlaceTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setPlaceTab(tab)}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
              placeTab === tab ? 'bg-background shadow' : 'text-muted-foreground',
            )}
          >
            {tab === 'candidates' ? '후보 장소' : '추천'}
          </button>
        ))}
      </div>

      {placeTab === 'candidates' && (
        <div className="mt-3 space-y-3">
          {candidates
            .filter(c => c.id !== representativeCandidateId)
            .map(candidate => {
              const place = candidate.place

              return (
                <button
                  key={candidate.id}
                  disabled={busy}
                  onClick={() => onSwitchPlace(candidate.id)}
                  className={cn(
                    'flex w-full items-center gap-3',
                    'rounded-xl border border-border/50 bg-background/40 p-4',
                    'transition-all duration-150 hover:bg-secondary/100',
                    'disabled:opacity-60',
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-primary">{place.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="flex w-4 shrink-0 justify-center">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="line-clamp-1">{place.location}</span>
                    </div>
                  </div>
                </button>
              )
            })}
        </div>
      )}

      {placeTab === 'recommend' && (
        <div className="mt-3 flex min-h-0 flex-1 flex-col space-y-3">
          <div className="space-y-2">
            {!mapReady && (
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-border/50 text-sm text-muted-foreground">
                지도 불러오는 중...
              </div>
            )}

            {mapReady && (
              <PlaceMap
                center={
                  markerPlaces.length > 0
                    ? { lat: markerPlaces[0].lat, lng: markerPlaces[0].lng }
                    : null
                }
                myLocation={null}
                places={markerPlaces}
                focusPlaceId={focusPlaceId}
                onMarkerClick={id => setFocusPlaceId(id)}
              />
            )}
          </div>
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

          {isAiLoading && <p className="text-sm mt-2 text-muted-foreground">불러오는 중...</p>}

          {!isAiLoading && recommendedPlaces.length === 0 && (
            <p className="text-sm text-muted-foreground">
              AI 추천 버튼을 눌러 추천 장소를 받아오세요.
            </p>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {recommendedPlaces.map(place => (
              <div
                key={`${place.externalId}-${place.name}`}
                onClick={() => setFocusPlaceId(place.externalId ?? place.name)}
                className={cn(
                  'rounded-xl border border-border/50 bg-background/40 p-4 transition-all duration-150',
                  'hover:bg-secondary/100',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-primary">{place.name}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="flex w-4 shrink-0 justify-center">
                        <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span>{place.distanceMeters.toLocaleString()}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="flex w-4 shrink-0 justify-center">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="line-clamp-1">{place.address}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{place.reason}</p>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleAdd(place)
                    }}
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-5 w-5 cursor-pointer" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
