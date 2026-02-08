import type { TriggerType } from '@/types/plan'

export interface SwitchLog {
  id: number
  planId: number
  categoryId: number
  triggerType: TriggerType
  decision: 'KEEP' | 'SWITCH'
  createdAt: string
}

export interface PlanStats {
  planId: number
  totalSwitches: number
  triggerCounts: Record<TriggerType, number>
  categoryChanges: number
}
