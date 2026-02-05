import type { CategoryType, TriggerType, Place, Plan } from '@/types/plan'

export const categoryLabels: Record<CategoryType, { label: string }> = {
  MEAL: { label: '식사' },
  CAFE: { label: '카페' },
  EXHIBITION: { label: '전시' },
  WALK: { label: '산책' },
  SHOPPING: { label: '쇼핑' },
  REST: { label: '휴식' },
}

export const triggerLabels: Record<TriggerType, string> = {
  WEATHER_BAD: '날씨 악화',
  WAITING_TOO_LONG: '대기시간 과다',
  PLACE_CLOSED: '영업 중단',
  FATIGUE: '체력 저하',
  DISTANCE_TOO_FAR: '거리 부담',
}

const THUMBNAIL = '/seoul_forest.jpg'

export const mockSearchResults: Place[] = [
  {
    id: 'search-1',
    name: '서울숲',
    location: '서울 성동구',
    rating: 4.8,
    isIndoor: false,
    thumbnailUrl: THUMBNAIL,
  },
  {
    id: 'search-2',
    name: '서울숲 카페',
    location: '서울 성동구',
    rating: 4.5,
    isIndoor: true,
    thumbnailUrl: THUMBNAIL,
  },
]

export const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    title: '성수동 데이트',
    date: '2026-01-20',
    region: '서울 성수동',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-10',
    categories: [
      {
        id: 'cat-1',
        type: 'MEAL',
        order: 1,
        representativePlace: {
          id: 'meal-1',
          name: '성수 파스타',
          location: '서울 성동구',
          rating: 4.5,
          isIndoor: true,
          thumbnailUrl: THUMBNAIL,
          isRepresentative: true,
        },
        candidates: [
          {
            id: 'meal-1',
            name: '성수 파스타',
            location: '서울 성동구',
            rating: 4.5,
            isIndoor: true,
            thumbnailUrl: THUMBNAIL,
            isRepresentative: true,
          },
          {
            id: 'meal-2',
            name: '뚝섬 한식당',
            location: '서울 성동구',
            rating: 4.3,
            isIndoor: true,
            thumbnailUrl: THUMBNAIL,
          },
        ],
      },
      {
        id: 'cat-2',
        type: 'WALK',
        order: 2,
        representativePlace: {
          id: 'walk-1',
          name: '서울숲 산책로',
          location: '서울 성동구',
          rating: 4.8,
          isIndoor: false,
          thumbnailUrl: THUMBNAIL,
          isRepresentative: true,
        },
        candidates: [
          {
            id: 'walk-1',
            name: '서울숲 산책로',
            location: '서울 성동구',
            rating: 4.8,
            isIndoor: false,
            thumbnailUrl: THUMBNAIL,
            isRepresentative: true,
          },
        ],
      },
      {
        id: 'cat-3',
        type: 'CAFE',
        order: 3,
        representativePlace: {
          id: 'cafe-1',
          name: '서울숲 카페',
          location: '서울 성동구',
          rating: 4.6,
          isIndoor: true,
          thumbnailUrl: THUMBNAIL,
          isRepresentative: true,
        },
        candidates: [
          {
            id: 'cafe-1',
            name: '서울숲 카페',
            location: '서울 성동구',
            rating: 4.6,
            isIndoor: true,
            thumbnailUrl: THUMBNAIL,
            isRepresentative: true,
          },
        ],
      },
    ],
  },
]
