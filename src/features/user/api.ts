import type { MyPageDTO } from './types'
import { mockMyPage } from './mock/mockMyPage'

export async function fetchMyPage(): Promise<MyPageDTO> {
  // TODO
  return new Promise(resolve => setTimeout(() => resolve(mockMyPage), 300))
}
