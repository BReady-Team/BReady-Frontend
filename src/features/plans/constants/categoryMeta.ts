import { Utensils, Coffee, Palette, TreePine, ShoppingBag, Bed } from 'lucide-react'
import type { CategoryType } from '@/types/plan'

export const categoryMeta: Record<
  CategoryType,
  {
    label: string
    Icon: React.FC<{ className?: string }>
  }
> = {
  MEAL: {
    label: '식사',
    Icon: Utensils,
  },
  CAFE: {
    label: '카페',
    Icon: Coffee,
  },
  EXHIBITION: {
    label: '전시',
    Icon: Palette,
  },
  WALK: {
    label: '산책',
    Icon: TreePine,
  },
  SHOPPING: {
    label: '쇼핑',
    Icon: ShoppingBag,
  },
  REST: {
    label: '휴식',
    Icon: Bed,
  },
}
