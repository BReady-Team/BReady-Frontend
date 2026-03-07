import { http } from '@/lib/http'

export const createCategory = async (planId: number, categoryType: string) => {
  const res = await http.post(`/api/v1/plans/${planId}/categories`, {
    categoryType,
  })

  return res.data.data
}
