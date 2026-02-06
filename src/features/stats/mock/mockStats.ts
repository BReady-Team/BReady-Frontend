import type { PlanStats, SwitchLog } from '../types/statsTypes'

export const mockSwitchLogs: SwitchLog[] = [
  {
    id: 1,
    planId: 1,
    categoryId: 2,
    triggerType: 'WEATHER_BAD',
    decision: 'SWITCH',
    createdAt: '2026-01-20T14:30:00',
  },
  {
    id: 2,
    planId: 1,
    categoryId: 1,
    triggerType: 'WAITING_TOO_LONG',
    decision: 'SWITCH',
    createdAt: '2026-01-20T12:15:00',
  },
  {
    id: 3,
    planId: 2,
    categoryId: 5,
    triggerType: 'FATIGUE',
    decision: 'KEEP',
    createdAt: '2026-01-25T15:00:00',
  },
]

export const mockPlanStats: PlanStats[] = [
  {
    planId: 1,
    totalSwitches: 2,
    triggerCounts: {
      WEATHER_BAD: 1,
      WAITING_TOO_LONG: 1,
      PLACE_CLOSED: 0,
      FATIGUE: 0,
      DISTANCE_TOO_FAR: 0,
    },
    categoryChanges: 1,
  },
  {
    planId: 2,
    totalSwitches: 1,
    triggerCounts: {
      WEATHER_BAD: 0,
      WAITING_TOO_LONG: 0,
      PLACE_CLOSED: 0,
      FATIGUE: 1,
      DISTANCE_TOO_FAR: 0,
    },
    categoryChanges: 0,
  },
]
