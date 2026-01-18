import { useState } from 'react'
import { X, Search, MapPin, Star, Plus, Sparkles } from 'lucide-react'
import type { Place } from '@/types/plan'
import { cn } from '@/lib/utils'
import { mockSearchResults } from '../mock/mockPlans'

interface SearchPanelProps {
  onClose: () => void
  onAddPlace: (place: Place) => void
}

/* 후보 장소 추가용 패널 -> 검색 , AI 추천, 지도 선택 기능 */
export default function SearchPanel({ onClose, onAddPlace }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /* 검색 실행 */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setResults(mockSearchResults)
      setIsLoading(false)
    }, 300)
  }

  /* AI 추천 */
  const handleRecommend = () => {
    setIsLoading(true)

    setTimeout(() => {
      setResults(mockSearchResults)
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={onClose} />

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
                  'focus:outline-none focus:ring-1 focus:ring-primary/30',
                )}
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-md border border-border/50 text-sm hover:bg-secondary"
            >
              검색
            </button>
          </form>

          {/* AI 추천 */}
          <button
            onClick={handleRecommend}
            disabled={isLoading}
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'h-12 rounded-lg text-sm font-medium',
              'bg-primary/10 text-primary border border-primary/20',
              'hover:bg-primary/20 transition-colors',
            )}
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? '추천 중...' : 'AI 추천받기'}
          </button>

          {/* 지도 영역 (UI) */}
          <div className="h-40 rounded-lg border border-border/50 bg-secondary/40 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="mx-auto h-6 w-6 mb-1" />
              <p className="text-xs">지도에서 선택</p>
            </div>
          </div>

          {/* 검색 결과 */}
          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">검색 결과</p>

              {results.map(place => (
                <div
                  key={place.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-secondary/40 transition-colors"
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
                    onClick={() => onAddPlace(place)}
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
