import { http } from '@/lib/http'

export interface PlanCreateRequest {
  title: string
  planDate: string
  region: string
}

export interface PlanCreateResponse {
  planId: number
  createdAt: string
}

export const createPlan = async (body: PlanCreateRequest): Promise<PlanCreateResponse> => {
  const res = await http.post('/api/v1/plans', body)

  return res.data.data
}
