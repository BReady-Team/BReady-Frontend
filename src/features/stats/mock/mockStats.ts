import type { PlanStats, SwitchLog } from '../types/statsTypes'

export const mockSwitchLogs: SwitchLog[] = [
  {
    id: 'log-1',
    planId: 'plan-1',
    categoryId: 'cat-2',
    triggerType: 'WEATHER_BAD',
    decision: 'SWITCH',
    createdAt: '2026-01-20T14:30:00',
  },
  {
    id: 'log-2',
    planId: 'plan-1',
    categoryId: 'cat-1',
    triggerType: 'WAITING_LONG',
    decision: 'SWITCH',
    createdAt: '2026-01-20T12:15:00',
  },
  {
    id: 'log-3',
    planId: 'plan-2',
    categoryId: 'cat-5',
    triggerType: 'FATIGUE',
    decision: 'KEEP',
    createdAt: '2026-01-25T15:00:00',
  },
]

export const mockPlanStats: PlanStats[] = [
  {
    planId: 'plan-1',
    totalSwitches: 2,
    triggerCounts: {
      WEATHER_BAD: 1,
      WAITING_LONG: 1,
      CLOSED: 0,
      FATIGUE: 0,
      DISTANCE_FAR: 0,
    },
    categoryChanges: 1,
  },
  {
    planId: 'plan-2',
    totalSwitches: 1,
    triggerCounts: {
      WEATHER_BAD: 0,
      WAITING_LONG: 0,
      CLOSED: 0,
      FATIGUE: 1,
      DISTANCE_FAR: 0,
    },
    categoryChanges: 0,
  },
]
