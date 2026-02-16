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
  representativeCandidateId: number
  candidates: Candidate[]
}

export type Candidate = {
  id: number // candidateId (삭제 대상)
  place: Place // 실제 장소 정보
  isRepresentative: boolean
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
