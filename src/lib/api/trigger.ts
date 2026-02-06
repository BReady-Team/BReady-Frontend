import { http } from '../http'

export type TriggerType =
  | 'WEATHER_BAD'
  | 'WAITING_TOO_LONG'
  | 'PLACE_CLOSED'
  | 'FATIGUE'
  | 'DISTANCE_TOO_FAR'

export type DecisionType = 'KEEP' | 'SWITCH'

// 트리거 발생
export const createTrigger = async (
  planId: number,
  categoryId: number,
  triggerType: TriggerType,
) => {
  const res = await http.post('/api/v1/triggers', {
    planId,
    categoryId,
    triggerType,
  })

  return res.data.data as { triggerId: number; occurredAt: string }
}

// 결정
export const createDecision = async (triggerId: number, decisionType: DecisionType) => {
  const res = await http.post(`/api/v1/triggers/${triggerId}/decision`, {
    decisionType,
  })

  return res.data.data as {
    decisionId: number
    decisionType: DecisionType
    decidedAt: string
    needSwitch: boolean
  }
}

// 스위치 실행 (대표 장소 변경 확정)
export const executeSwitch = async (decisionId: number, toCandidateId: number) => {
  const res = await http.post(`/api/v1/triggers/${decisionId}/switch`, {
    toCandidateId,
  })

  return res.data.data as {
    switchLogId: number
    fromCandidateId: number
    toCandidateId: number
    switchedAt: string
  }
}
