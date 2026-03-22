import { useEffect, useMemo, useState } from 'react'
import { X, Search, MapPin, Plus, CheckCircle2, XCircle } from 'lucide-react'
import type { Place } from '@/types/plan'
import type { PlaceCategoryType, PlaceSearchResponse } from '@/lib/api/place'
import { cn } from '@/lib/utils'
import { createCandidate, searchPlaces, type CreateCandidateRequest } from '@/lib/api/place'
import { getCurrentLocation } from '@/lib/geolocation'
import { useKakaoMapLoader } from '@/lib/kakao/useKakaoMapLoader'
import PlaceMap, { type MapPlaceMarker } from '../components/PlaceMap'

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
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [focusPlaceId, setFocusPlaceId] = useState<number | string | null>(null)
  const [searchMessage, setSearchMessage] = useState<string | null>(null)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const mapReady = useKakaoMapLoader(import.meta.env.VITE_KAKAO_MAP_APP_KEY)

  // 패널 열릴 때 현재 위치 한번 받아오기 (권한 거부면 null 유지)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const pos = await getCurrentLocation()
        if (!mounted) return
        setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      } catch (err) {
        console.warn('위치 정보를 가져오지 못했습니다.', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsFetching(true)
    setFocusPlaceId(null)
    setSearchMessage(null)

    try {
      const lat = myLocation?.lat
      const lng = myLocation?.lng

      const data = await searchPlaces(categoryType, query, lat, lng)

      const mapped: Place[] = (data ?? []).map((p: PlaceSearchResponse) => ({
        id: Number(p.externalId.replace('kakao-', '')),
        externalId: p.externalId,
        name: p.name,
        location: p.address ?? '',
        latitude: p.latitude,
        longitude: p.longitude,
        rating: 0,
        isIndoor: p.isIndoor ?? false,
      }))

      setResults(mapped)

      if (mapped.length === 0) {
        setSearchMessage('검색 결과가 없습니다.')
      }
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setResults([])
        setSearchMessage('검색 결과가 없습니다.')
        return
      }

      setResults([])
      setSearchMessage('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      console.error('Places search error:', e)
    } finally {
      setIsFetching(false)
    }
  }

  const markerPlaces: MapPlaceMarker[] = useMemo(
    () =>
      results
        .filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number')
        .map(p => ({
          id: p.id,
          name: p.name,
          lat: p.latitude!,
          lng: p.longitude!,
        })),
    [results],
  )

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
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

    try {
      const res = await createCandidate(body)

      const savedPlace: Place = {
        id: res.candidateId,
        externalId: res.place.externalId,
        name: res.place.name,
        location: res.place.address ?? '',
        rating: 0,
        isIndoor: res.place.isIndoor ?? false,
        isRepresentative: false,
      }

      onAddPlace(savedPlace)
      showToast(`"${savedPlace.name}" 가 후보 장소에 추가되었습니다.`, 'success')
    } catch (e) {
      console.error('장소 추가 오류:', e)
      showToast('장소를 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.', 'error')
    }
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

      <aside
        className="
        fixed inset-y-0 right-0 z-50 
        flex w-full max-w-2xl flex-col
        border-l border-border bg-background shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border/50 p-4">
          {toast && (
            <div className="absolute right-4 top-16 z-50">
              <div
                role={toast.type === 'error' ? 'alert' : 'status'}
                aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-5 py-4 shadow-lg"
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}

                <p className="text-sm font-medium text-foreground">{toast.message}</p>

                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
          <h2 className="text-sm font-medium">장소 추가</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col p-6">
          <p className="text-sm text-muted-foreground">후보 장소에 추가할 곳을 찾아보세요.</p>

          {/* 지도 */}
          <div className="space-y-2">
            {!mapReady && (
              <div className="h-[300px] rounded-lg border border-border/50 flex items-center justify-center text-sm text-muted-foreground">
                지도 불러오는 중...
              </div>
            )}

            {mapReady && (
              <PlaceMap
                center={myLocation}
                myLocation={myLocation}
                places={markerPlaces}
                focusPlaceId={focusPlaceId}
                onMarkerClick={id => setFocusPlaceId(id)}
              />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            현재 위치 마커 + 검색 결과 마커가 지도에 표시됩니다.
          </p>

          {/* 검색 */}
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

          {isFetching && <p className="text-sm mt-4">불러오는 중...</p>}

          {!isFetching && searchMessage && (
            <p className="mt-4 text-sm text-muted-foreground">{searchMessage}</p>
          )}

          {/* 검색 결과 */}
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
            {results.length > 0 && (
              <div className="space-y-3 pb-1">
                <p className="text-sm text-muted-foreground">검색 결과</p>

                {results.map(place => (
                  <div
                    key={place.externalId ?? place.id}
                    className={cn(
                      'flex items-start justify-between gap-4',
                      'rounded-xl border border-border/50 bg-background/40 p-4',
                      'transition-all duration-150 hover:bg-secondary/100',
                    )}
                    onClick={() => setFocusPlaceId(place.id)}
                  >
                    <div className="min-w-0 flex-1 space-y-2">
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

                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleAdd(place)
                      }}
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
