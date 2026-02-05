import { useState } from 'react'
import {
  X,
  ArrowLeft,
  Check,
  ArrowRightLeft,
  RefreshCw,
  CloudRain,
  Clock,
  XCircle,
  Battery,
  MapPin,
} from 'lucide-react'

import type { CategoryType, TriggerType, Place } from '@/types/plan'
import { categoryLabels, triggerLabels, mockSearchResults } from '../mock/mockPlans'
import { cn } from '@/lib/utils'

const triggerIcons: Record<TriggerType, React.ElementType> = {
  WEATHER_BAD: CloudRain,
  WAITING_TOO_LONG: Clock,
  PLACE_CLOSED: XCircle,
  FATIGUE: Battery,
  DISTANCE_TOO_FAR: MapPin,
}

interface TriggerPanelProps {
  isOpen: boolean
  categoryType: CategoryType
  candidates: Place[]
  representativePlaceId: string

  onClose: () => void
  onKeep: () => void
  onChangeCategory: (type: CategoryType) => void
  onChangePlace: (place: Place) => void
}

type PlaceTab = 'candidates' | 'recommend'

/* 트리거 발생 시 대응 관련 패널 */
export default function TriggerPanel({
  isOpen,
  categoryType,
  candidates,
  representativePlaceId,
  onClose,
  onKeep,
  onChangeCategory,
  onChangePlace,
}: TriggerPanelProps) {
  const [step, setStep] = useState<'select' | 'decision' | 'change-category' | 'change-place'>(
    'select',
  )
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null)
  const [placeTab, setPlaceTab] = useState<PlaceTab>('candidates')

  if (!isOpen) return null

  /* 공통 초기화 */
  const resetAndClose = () => {
    setStep('select')
    setSelectedTrigger(null)
    setPlaceTab('candidates')
    onClose()
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="패널 닫기"
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={resetAndClose}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') resetAndClose()
        }}
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-background shadow-xl">
        <header className="flex items-center justify-between border-b border-border/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            {step !== 'select' && (
              <button
                onClick={() => (step === 'decision' ? setStep('select') : setStep('decision'))}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            트리거 대응
          </div>

          <button
            onClick={resetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          {/* 트리거 선택 */}
          {step === 'select' && (
            <>
              <p className="text-sm text-muted-foreground">어떤 상황이 발생했나요?</p>

              <div className="space-y-2">
                {(Object.keys(triggerLabels) as TriggerType[]).map(trigger => {
                  const Icon = triggerIcons[trigger]
                  return (
                    <button
                      key={trigger}
                      onClick={() => {
                        setSelectedTrigger(trigger)
                        setStep('decision')
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-4 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{triggerLabels[trigger]}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* 결정 */}
          {step === 'decision' && selectedTrigger && (
            <>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {(() => {
                    const Icon = triggerIcons[selectedTrigger]
                    return <Icon className="h-4 w-4 text-primary" />
                  })()}
                  {triggerLabels[selectedTrigger]}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">어떻게 하시겠어요?</p>

              {/* 유지 */}
              <button
                onClick={() => {
                  onKeep()
                  resetAndClose()
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-border/50 p-4 hover:bg-secondary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">그대로 유지</p>
                  <p className="text-xs text-muted-foreground">현재 계획대로 진행</p>
                </div>
              </button>

              {/* 카테고리 변경 */}
              <button
                onClick={() => setStep('change-category')}
                className="flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">카테고리 변경</p>
                  <p className="text-xs text-muted-foreground">다른 활동으로 전환</p>
                </div>
              </button>

              {/* 장소 변경 */}
              <button
                onClick={() => setStep('change-place')}
                className="flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">장소 변경</p>
                  <p className="text-xs text-muted-foreground">다른 장소로 전환</p>
                </div>
              </button>
            </>
          )}

          {/* 카테고리 변경 관련 */}
          {step === 'change-category' && (
            <>
              <p className="text-sm text-muted-foreground">어떤 활동으로 변경할까요?</p>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(categoryLabels) as CategoryType[])
                  .filter(t => t !== categoryType)
                  .map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        onChangeCategory(type)
                        resetAndClose()
                      }}
                      className="rounded-xl border border-border/50 p-4 hover:bg-secondary/50"
                    >
                      <p className="text-sm font-medium">{categoryLabels[type].label}</p>
                    </button>
                  ))}
              </div>
            </>
          )}

          {/* 장소 변경 관련 */}
          {step === 'change-place' && (
            <>
              {/* 탭 */}
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

              {/* 후보 장소 */}
              {placeTab === 'candidates' &&
                candidates
                  .filter(p => p.id !== representativePlaceId)
                  .map(place => (
                    <button
                      key={place.id}
                      onClick={() => {
                        onChangePlace(place)
                        resetAndClose()
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-secondary/50"
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

              {/* 추천 */}
              {placeTab === 'recommend' &&
                mockSearchResults.map(place => (
                  <button
                    key={place.id}
                    onClick={() => {
                      onChangePlace(place)
                      resetAndClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-secondary/50"
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
          )}
        </div>
      </aside>
    </>
  )
}
