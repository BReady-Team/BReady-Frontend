import type { CategoryType } from '@/types/common'

export interface PlanCategorySummary {
  id: number
  categoryType: CategoryType
  sequence: number
}

export interface PlanSummaryDTO {
  id: number
  title: string
  planDate: string
  region: string
  categories: PlanCategorySummary[]
}
