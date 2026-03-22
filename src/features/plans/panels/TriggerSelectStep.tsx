import { CloudRain, Clock, XCircle, Battery, MapPin } from 'lucide-react'

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

interface TriggerSelectStepProps {
  busy: boolean
  onSelectTrigger: (trigger: TriggerType) => Promise<void>
}

export default function TriggerSelectStep({ busy, onSelectTrigger }: TriggerSelectStepProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">어떤 상황이 발생했나요?</p>

      <div className="space-y-2">
        {(Object.keys(triggerLabels) as TriggerType[]).map(trigger => {
          const Icon = triggerIcons[trigger]

          return (
            <button
              key={trigger}
              disabled={busy}
              onClick={() => onSelectTrigger(trigger)}
              className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-secondary/50 disabled:opacity-60"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{triggerLabels[trigger]}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
