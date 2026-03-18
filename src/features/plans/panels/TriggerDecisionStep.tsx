import {
  Check,
  ArrowRightLeft,
  RefreshCw,
  CloudRain,
  Clock,
  XCircle,
  Battery,
  MapPin,
} from 'lucide-react'
import type { TriggerType } from '@/types/plan'
import type { ElementType } from 'react'

const triggerIcons: Record<TriggerType, ElementType> = {
  WEATHER_BAD: CloudRain,
  WAITING_TOO_LONG: Clock,
  PLACE_CLOSED: XCircle,
  FATIGUE: Battery,
  DISTANCE_TOO_FAR: MapPin,
}

const triggerLabels: Record<TriggerType, string> = {
  WEATHER_BAD: '날씨가 좋지 않음',
  WAITING_TOO_LONG: '대기 시간이 너무 김',
  PLACE_CLOSED: '장소가 영업하지 않음',
  FATIGUE: '피로함',
  DISTANCE_TOO_FAR: '거리가 너무 멂',
}

interface TriggerDecisionStepProps {
  selectedTrigger: TriggerType
  busy: boolean
  onKeep: () => Promise<void>
  onGoChangeCategory: () => void
  onGoChangePlace: () => void
}

export default function TriggerDecisionStep({
  selectedTrigger,
  busy,
  onKeep,
  onGoChangeCategory,
  onGoChangePlace,
}: TriggerDecisionStepProps) {
  const Icon = triggerIcons[selectedTrigger]

  return (
    <>
      <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <p className="text-lg font-semibold text-foreground">{triggerLabels[selectedTrigger]}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">어떻게 하시겠어요?</p>

      <button
        disabled={busy}
        onClick={() => onKeep()}
        className="mt-4 flex w-full items-center gap-4 rounded-xl border border-border/50 bg-background/40 p-4 transition-all duration-150 hover:bg-secondary/100 disabled:opacity-60"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <Check className="h-5 w-5 text-foreground" />
        </div>
        <div className="space-y-1.5 text-left">
          <p className="text-sm font-medium">그대로 유지</p>
          <p className="text-xs text-muted-foreground">현재 계획대로 진행</p>
        </div>
      </button>

      <button
        disabled={busy}
        onClick={onGoChangeCategory}
        className="mt-3 flex w-full items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all duration-150 hover:bg-primary/10 disabled:opacity-60"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1.5 text-left">
          <p className="text-sm font-medium">카테고리 변경</p>
          <p className="text-xs text-muted-foreground">다른 활동으로 전환</p>
        </div>
      </button>

      <button
        disabled={busy}
        onClick={onGoChangePlace}
        className="mt-3 flex w-full items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all duration-150 hover:bg-primary/10 disabled:opacity-60"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1.5 text-left">
          <p className="text-sm font-medium">장소 변경</p>
          <p className="text-xs text-muted-foreground">다른 장소로 전환</p>
        </div>
      </button>
    </>
  )
}
