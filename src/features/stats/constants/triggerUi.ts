import { CloudRain, Clock, XCircle, Battery, MapPin } from 'lucide-react'
import type { TriggerType } from '@/types/plan'

export const triggerUiMap: Record<
  TriggerType,
  {
    Icon: React.ElementType
    className: string
  }
> = {
  WEATHER_BAD: {
    Icon: CloudRain,
    className: 'bg-blue-500/20 text-blue-400',
  },
  WAITING_LONG: {
    Icon: Clock,
    className: 'bg-amber-500/20 text-amber-400',
  },
  FATIGUE: {
    Icon: Battery,
    className: 'bg-purple-500/20 text-purple-400',
  },
  CLOSED: {
    Icon: XCircle,
    className: 'bg-red-500/20 text-red-400',
  },
  DISTANCE_FAR: {
    Icon: MapPin,
    className: 'bg-green-500/20 text-green-400',
  },
}
