import type { PlanSummaryDTO } from './types'

const MOCK_PLANS: PlanSummaryDTO[] = [
  {
    id: 1,
    title: '성수동 데이트',
    planDate: '2025-01-20',
    region: '서울 성수동',
    categories: [
      { id: 101, categoryType: 'MEAL', sequence: 1 },
      { id: 102, categoryType: 'CAFE', sequence: 2 },
      { id: 103, categoryType: 'EXHIBITION', sequence: 3 },
      { id: 104, categoryType: 'WALK', sequence: 4 },
    ],
  },
  {
    id: 2,
    title: '홍대 일정',
    planDate: '2025-01-25',
    region: '서울 홍대',
    categories: [
      { id: 201, categoryType: 'SHOPPING', sequence: 1 },
      { id: 202, categoryType: 'CAFE', sequence: 2 },
      { id: 203, categoryType: 'MEAL', sequence: 3 },
    ],
  },
  {
    id: 3,
    title: '강남 미팅',
    planDate: '2025-02-01',
    region: '서울 강남',
    categories: [
      { id: 301, categoryType: 'MEAL', sequence: 1 },
      { id: 302, categoryType: 'CAFE', sequence: 2 },
    ],
  },
]

export async function fetchPlanSummaries(): Promise<PlanSummaryDTO[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_PLANS), 250)
  })
}
