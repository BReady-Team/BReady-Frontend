export type CategoryType = 'MEAL' | 'CAFE' | 'EXHIBITION' | 'WALK' | 'SHOPPING' | 'REST'
export type TriggerType =
  | 'WEATHER_BAD'
  | 'WAITING_TOO_LONG'
  | 'PLACE_CLOSED'
  | 'FATIGUE'
  | 'DISTANCE_TOO_FAR'

export type Place = {
  id: number
  externalId?: string
  name: string
  location: string
  latitude?: number
  longitude?: number
  rating: number
  isIndoor: boolean
  thumbnailUrl?: string
  isRepresentative?: boolean
}

export type Category = {
  id: number
  type: CategoryType
  order: number
  representativePlace: Place
  candidates: Place[]
}

export type Plan = {
  id: number
  title: string
  date: string
  region: string
  categories: Category[]
  createdAt: string
  updatedAt: string
}
