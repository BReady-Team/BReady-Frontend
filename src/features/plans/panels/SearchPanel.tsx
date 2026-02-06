import { useState } from 'react'
import { X, Search, MapPin, Star, Plus, Sparkles } from 'lucide-react'

import type { Place } from '@/types/plan'
import type { PlaceCategoryType, PlaceSearchResponse } from '@/lib/api/place'

import { cn } from '@/lib/utils'
import { mockSearchResults } from '../mock/mockPlans'

import { createCandidate, searchPlaces, type CreateCandidateRequest } from '@/lib/api/place'
import { getCurrentLocation } from '@/lib/geolocation'

interface SearchPanelProps {
  planId: number
  categoryId: number
  categoryType: PlaceCategoryType
  onClose: () => void
  onAddPlace: (place: Place) => void
}

export default function SearchPanel({
  planId,
  categoryId,
  categoryType,
  onClose,
  onAddPlace,
}: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsFetching(true)

    try {
      let lat: number | undefined
      let lng: number | undefined

      try {
        const position = await getCurrentLocation()
        lat = position.coords.latitude
        lng = position.coords.longitude
      } catch {
        console.warn('위치 권한 거부 → 위치 없이 검색')
      }

      const data = await searchPlaces(categoryType, query, lat, lng)

      const mapped: Place[] = data.map((p: PlaceSearchResponse) => ({
        id: Number(p.externalId.replace('kakao-', '')),
        externalId: p.externalId,
        name: p.name,
        location: p.address ?? '',
        latitude: p.latitude,
        longitude: p.longitude,
        rating: 0,
        isIndoor: p.isIndoor ?? false,
        thumbnailUrl: '/seoul_forest.jpg',
      }))

      setResults(mapped)
    } finally {
      setIsFetching(false)
    }
  }

  const handleAdd = async (place: Place) => {
    const body: CreateCandidateRequest = {
      planId,
      categoryId,
      externalId: place.externalId!,
      name: place.name,
      address: place.location,
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
      rating: 0,
      isIndoor: res.place.isIndoor ?? false,
      thumbnailUrl: '/seoul_forest.jpg',
      isRepresentative: false,
    }

    onAddPlace(savedPlace)
  }

  const handleRecommend = () => {
    setIsAiLoading(true)

    setTimeout(() => {
      setResults(mockSearchResults)
      setIsAiLoading(false)
    }, 500)
  }
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="패널 닫기"
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-background shadow-xl">
        <header className="flex items-center justify-between border-b border-border/50 p-4">
          <h2 className="text-sm font-medium">장소 추가</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">후보 장소에 추가할 곳을 찾아보세요</p>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="장소명, 키워드로 검색"
                className={cn(
                  'h-10 w-full rounded-md',
                  'bg-secondary/50 border border-border/50',
                  'pl-10 pr-3 text-sm',
                )}
              />
            </div>
            <button className="h-10 px-4 rounded-md border border-border/50 text-sm hover:bg-secondary">
              검색
            </button>
          </form>

          {/* AI 추천 */}
          <button
            onClick={handleRecommend}
            disabled={isAiLoading}
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'h-12 rounded-lg text-sm font-medium',
              'bg-primary/10 text-primary border border-primary/20',
              'hover:bg-primary/20 transition-colors',
            )}
          >
            <Sparkles className="h-4 w-4" />
            {isAiLoading ? '추천 중...' : 'AI 추천받기'}
          </button>

          {(isFetching || isAiLoading) && <p className="text-sm">불러오는 중...</p>}

          {/* 검색 결과 */}
          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">검색 결과</p>

              {results.map(place => (
                <div
                  key={place.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-secondary/40"
                >
                  <div>
                    <p className="text-sm font-medium">{place.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {place.location}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        {place.rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(place)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
