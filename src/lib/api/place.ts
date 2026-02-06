import { http } from '../http'

export type PlaceCategoryType = 'MEAL' | 'CAFE' | 'EXHIBITION' | 'WALK' | 'SHOPPING' | 'REST'

export interface PlaceSearchResponse {
  externalId: string
  name: string
  address: string
  latitude: number
  longitude: number
  isIndoor: boolean
}

export interface CreateCandidateRequest {
  planId: number
  categoryId: number
  externalId: string
  name: string
  address?: string
  latitude: number
  longitude: number
  isIndoor?: boolean
}

export interface CreateCandidateResponse {
  candidateId: number
  place: {
    id: number
    externalId: string
    name: string
    address?: string
    isIndoor?: boolean
  }
  createdAt: string
}

export const createCandidate = async (
  body: CreateCandidateRequest,
): Promise<CreateCandidateResponse> => {
  const res = await http.post('/api/v1/places/candidates', body)
  return res.data.data
}

export const searchPlaces = async (category: PlaceCategoryType): Promise<PlaceSearchResponse[]> => {
  const res = await http.get('/api/v1/places/search', {
    params: { category },
  })

  return res.data.data
}

export const setRepresentative = async (candidateId: number) => {
  const res = await http.post(`/api/v1/places/candidates/${candidateId}/representative`)

  return res.data.data
}
