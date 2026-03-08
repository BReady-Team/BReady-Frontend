import { http } from '@/lib/http'
import type { PlanListResponse } from './types'

// 플랜 목록 조회 GET /api/v1/plans
export const fetchPlanSummaries = async (): Promise<PlanListResponse> => {
  const res = await http.get('/api/v1/plans', {
    params: { page: 0, size: 10, order: 'DESC' },
  })

  const data = res.data.data

  console.log('plans response =', data)

  return {
    pageInfo: data.pageInfo,
    items: (data.items ?? []).map((p: any) => ({
      id: p.planId,
      title: p.title,
      planDate: p.planDate,
      region: p.region,

      // categories 없는 경우 방어
      categories: Array.isArray(p.categories) ? p.categories : [],
    })),
  }
}

// 플랜 상세 조회 GET /api/v1/plans/{planId}
export async function fetchPlanDetail(planId: number) {
  const res = await http.get(`/api/v1/plans/${planId}`)
  const data = res.data.data

  return {
    plan: data.plan,

    categories: data.categories.map((c: any) => ({
      id: c.planCategoryId,
      type: c.categoryType,
      order: c.sequence,
      representativeCandidateId: c.representativeCandidateId,

      candidates: (c.candidates ?? []).map((cd: any) => ({
        id: cd.candidateId,

        place: {
          id: cd.place.id,
          externalId: cd.place.externalId,
          name: cd.place.name,
          location: cd.place.address,
          latitude: cd.place.latitude,
          longitude: cd.place.longitude,
          rating: 0,
          isIndoor: cd.place.isIndoor ?? false,
        },

        isRepresentative: cd.isRepresentative ?? false,
      })),
    })),
  }
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

// 내 플랜 목록 조회 GET /api/v1/plans (최근 3개만)
export async function getMyPlans(page = 0, size = 3) {
  const res = await http.get('/api/v1/plans', {
    params: {
      page,
      size,
      order: 'DESC',
    },
  })

  return res.data.data
}

// 플랜 삭제 DELETE /api/v1/plans/{planId}
export async function deletePlan(planId: number) {
  await http.delete(`/api/v1/plans/${planId}`)
}

// 카테고리 타입 변경
export async function updatePlanCategoryType(
  planId: number,
  planCategoryId: number,
  categoryType: string,
) {
  const res = await http.patch(`/api/v1/plans/${planId}/categories/${planCategoryId}`, {
    categoryType,
  })

  return res.data.data
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
