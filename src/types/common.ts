export type CategoryType = 'MEAL' | 'CAFE' | 'EXHIBITION' | 'WALK' | 'SHOPPING' | 'REST'
export type TriggerType =
  | 'WEATHER_BAD'
  | 'WAITING_TOO_LONG'
  | 'PLACE_CLOSED'
  | 'FATIGUE'
  | 'DISTANCE_TOO_FAR'

export type DecisionType = 'KEEP' | 'SWITCH'

export const CATEGORY_LABEL: Record<CategoryType, string> = {
  MEAL: '식사',
  CAFE: '카페',
  EXHIBITION: '전시',
  WALK: '산책',
  SHOPPING: '쇼핑',
  REST: '휴식',
}
