import type { CategoryType } from '@/types/common'

export interface PlanListItemDto {
  id: number
  title: string
  planDate: string
  region: string
  categories: PlanCategorySummary[]
}

export interface PageInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PlanListResponse {
  items: PlanListItemDto[]
  pageInfo: PageInfo
}

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

export interface PlanDetailResponse {
  plan: {
    planId: number
    title: string
    planDate: string
    region: string
    status: string
    createdAt: string
    updatedAt: string
  }
  categories: CategoryResponse[]
}

export interface CategoryResponse {
  categoryId: number
  categoryType: CategoryType
  order: number
  representativeCandidateId: number
  candidates: CandidateResponse[]
}

export interface CandidateResponse {
  candidateId: number
  place: {
    id: number
    externalId?: string
    name: string
    address: string
    latitude: number
    longitude: number
    isIndoor: boolean
  }
  isRepresentative: boolean
}

export interface PlanDetailCategoryDto {
  id: number
  type: string
  order: number
  representativeCandidateId: number
  candidates: PlanDetailCandidateDto[]
}

export interface PlanDetailCandidateDto {
  candidateId: number
  place: {
    id: number
    externalId?: string
    name: string
    address: string
    latitude: number
    longitude: number
    isIndoor: boolean
  }
  isRepresentative: boolean
}
