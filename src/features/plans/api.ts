import { http } from '@/lib/http'
import type { PlanListResponse, PlanDetailResponse } from './types'

// 플랜 목록 조회 GET /api/v1/plans
export const fetchPlanSummaries = async (): Promise<PlanListResponse> => {
  const res = await http.get('/api/v1/plans', {
    params: {
      page: 0,
      size: 10,
      order: 'DESC',
    },
  })

  return res.data.data
}

// 플랜 상세 조회 GET /api/v1/plans/{planId}
export async function fetchPlanDetail(planId: number): Promise<PlanDetailResponse> {
  const res = await http.get(`/api/v1/plans/${planId}`)
  return res.data.data
}

// 플랜 생성 POST /api/v1/plans
export async function createPlan(body: { title: string; planDate: string; region: string }) {
  const res = await http.post('/api/v1/plans', body)
  return res.data.data
}

// 플랜 수정 PATCH /api/v1/plans/{planId}
export async function updatePlan(
  planId: number,
  body: {
    title: string
    planDate: string
    region: string
  },
) {
  const res = await http.patch(`/api/v1/plans/${planId}`, body)
  return res.data.data
}

// 플랜 삭제 DELETE /api/v1/plans/{planId}
export async function deletePlan(planId: number) {
  await http.delete(`/api/v1/plans/${planId}`)
}

// 카테고리 삭제
export async function deletePlanCategory(planId: number, planCategoryId: number) {
  const res = await http.delete(`/api/v1/plans/${planId}/categories/${planCategoryId}`)
  return res.data.data
}

// 장소 후보 삭제
export async function deleteCandidate(candidateId: number) {
  const res = await http.delete(`/api/v1/places/candidates/${candidateId}`)
  return res.data.data
}
