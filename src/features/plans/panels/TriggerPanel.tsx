import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'

import type { CategoryType, TriggerType, Candidate, Place } from '@/types/plan'
import { recommendCategory, recommendPlace } from '@/features/plans/api'

import TriggerSelectStep from './TriggerSelectStep'
import TriggerDecisionStep from './TriggerDecisionStep'
import TriggerCategoryStep from './TriggerCategoryStep'
import TriggerPlaceStep from './TriggerPlaceStep'

interface TriggerPanelProps {
  isOpen: boolean
  planId: number
  categoryId: number
  onAddPlace: (place: Place) => void
  region: string
  categoryType: CategoryType
  candidates: Candidate[]
  representativeCandidateId: number | null
  onClose: () => void
  onTrigger: (trigger: TriggerType) => Promise<{ triggerId: number }>
  onKeep: () => Promise<void>
  onSwitchPlace: (toCandidateId: number) => Promise<void>
  onChangeCategory: (type: CategoryType) => void
}

type PlaceTab = 'candidates' | 'recommend'
type Step = 'select' | 'decision' | 'change-category' | 'change-place'

export default function TriggerPanel({
  isOpen,
  planId,
  categoryId,
  onAddPlace,
  region,
  categoryType,
  candidates,
  representativeCandidateId,
  onClose,
  onTrigger,
  onKeep,
  onSwitchPlace,
  onChangeCategory,
}: TriggerPanelProps) {
  const [step, setStep] = useState<Step>('select')
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null)
  const [placeTab, setPlaceTab] = useState<PlaceTab>('candidates')
  const [busy, setBusy] = useState(false)

  const [currentTriggerId, setCurrentTriggerId] = useState<number | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [recommendedPlaces, setRecommendedPlaces] = useState<
    Array<{
      externalId: string
      name: string
      address: string
      latitude: number
      longitude: number
      isIndoor: boolean
      distanceMeters: number
      reason: string
    }>
  >([])

  const [recommendReason, setRecommendReason] = useState<string | undefined>(undefined)
  const [recommendedCategory, setRecommendedCategory] = useState<CategoryType | undefined>(
    undefined,
  )

  if (!isOpen) return null

  const resetAndClose = () => {
    setStep('select')
    setSelectedTrigger(null)
    setPlaceTab('candidates')
    setBusy(false)
    setCurrentTriggerId(null)
    setIsAiLoading(false)
    setRecommendedPlaces([])
    setRecommendReason(undefined)
    setRecommendedCategory(undefined)
    onClose()
  }

  const handleSelectTrigger = async (trigger: TriggerType) => {
    try {
      setBusy(true)

      const result = await onTrigger(trigger)
      setCurrentTriggerId(result.triggerId)

      setSelectedTrigger(trigger)

      setRecommendedPlaces([])
      setRecommendReason(undefined)
      setRecommendedCategory(undefined)

      setStep('decision')
    } finally {
      setBusy(false)
    }
  }

  const handleKeep = async () => {
    try {
      setBusy(true)
      await onKeep()
      resetAndClose()
    } finally {
      setBusy(false)
    }
  }

  const handleChangeCategory = (type: CategoryType) => {
    onChangeCategory(type)
    resetAndClose()
  }

  const handleSwitchPlace = async (toCandidateId: number) => {
    try {
      setBusy(true)
      await onSwitchPlace(toCandidateId)
      resetAndClose()
    } finally {
      setBusy(false)
    }
  }

  const handleRecommendPlace = async () => {
    if (!currentTriggerId) return

    const currentCandidate = candidates.find(c => c.id === representativeCandidateId)
    if (!currentCandidate) return

    const lat = currentCandidate.place.latitude
    const lng = currentCandidate.place.longitude

    if (lat == null || lng == null) return

    try {
      setIsAiLoading(true)
      setRecommendReason(undefined)
      setRecommendedCategory(undefined)

      const items = await recommendPlace(
        {
          region,
          latitude: lat,
          longitude: lng,
          radius: 3000,
          size: 5,
        },
        { triggerId: currentTriggerId },
      )

      setRecommendedPlaces(items)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleRecommendCategory = async () => {
    if (!currentTriggerId) return

    try {
      setIsAiLoading(true)
      setRecommendReason(undefined)

      const result = await recommendCategory({ triggerId: currentTriggerId })
      const first = result.items?.[0]

      setRecommendReason(first?.reason)
      setRecommendedCategory(first?.categoryType as CategoryType | undefined)
    } finally {
      setIsAiLoading(false)
    }
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

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-border bg-background shadow-xl">
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

        <div className="flex min-h-0 flex-1 flex-col p-6">
          {step === 'select' && (
            <TriggerSelectStep busy={busy} onSelectTrigger={handleSelectTrigger} />
          )}

          {step === 'decision' && selectedTrigger && (
            <TriggerDecisionStep
              selectedTrigger={selectedTrigger}
              busy={busy}
              onKeep={handleKeep}
              onGoChangeCategory={() => setStep('change-category')}
              onGoChangePlace={() => setStep('change-place')}
            />
          )}

          {step === 'change-category' && (
            <TriggerCategoryStep
              categoryType={categoryType}
              busy={busy}
              isAiLoading={isAiLoading}
              recommendCategory={recommendedCategory}
              recommendReason={recommendReason}
              onChangeCategory={handleChangeCategory}
              onRecommendClick={handleRecommendCategory}
            />
          )}

          {step === 'change-place' && (
            <TriggerPlaceStep
              planId={planId}
              categoryId={categoryId}
              onAddPlace={onAddPlace}
              placeTab={placeTab}
              setPlaceTab={setPlaceTab}
              candidates={candidates}
              representativeCandidateId={representativeCandidateId}
              busy={busy}
              onSwitchPlace={handleSwitchPlace}
              recommendedPlaces={recommendedPlaces}
              isAiLoading={isAiLoading}
              onRecommendClick={handleRecommendPlace}
            />
          )}
        </div>
      </aside>
    </>
  )
}
