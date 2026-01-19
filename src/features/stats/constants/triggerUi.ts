import { CloudRain, Clock, XCircle, Battery, MapPin } from 'lucide-react'
import type { TriggerType } from '@/types/plan'

export const triggerUiMap: Record<
  TriggerType,
  {
    icon: React.ElementType
    label: string
    color: string
  }
> = {
  WEATHER_BAD: {
    icon: CloudRain,
    label: '날씨 악화',
    color: 'bg-blue-500/20 text-blue-400',
  },
  WAITING_LONG: {
    icon: Clock,
    label: '대기시간 과다',
    color: 'bg-amber-500/20 text-amber-400',
  },
  CLOSED: {
    icon: XCircle,
    label: '영업 중단',
    color: 'bg-red-500/20 text-red-400',
  },
  FATIGUE: {
    icon: Battery,
    label: '체력 저하',
    color: 'bg-purple-500/20 text-purple-400',
  },
  DISTANCE_FAR: {
    icon: MapPin,
    label: '거리 부담',
    color: 'bg-green-500/20 text-green-400',
  },
}
