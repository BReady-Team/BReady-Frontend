import { http } from '../http'

export interface PlaceSearchResponse {
  externalId: string
  name: string
  address: string
  latitude: number
  longitude: number
  isIndoor: boolean
}

export const searchPlaces = async (category: string) => {
  const res = await http.get('/api/v1/places/search', {
    params: { category },
  })

  return res.data.data as PlaceSearchResponse[]
}

interface CreateCandidateRequest {
  planId: number
  categoryId: number
  externalId: string
  name: string
  address?: string
  latitude: number
  longitude: number
  isIndoor?: boolean
}

export const createCandidate = async (body: CreateCandidateRequest) => {
  const res = await http.post('/api/v1/places/candidates', body)

  return res.data.data
}

export const setRepresentative = async (candidateId: number) => {
  const res = await http.post(`/api/v1/places/candidates/${candidateId}/representative`)

  return res.data.data
}
