import type { PlanCategorySummary } from '../types'
import { CATEGORY_LABEL } from '@/types/common'

interface Props {
  categories: PlanCategorySummary[]
}

export function PlanCategoryChips({ categories }: Props) {
  const sorted = [...categories].sort((a, b) => a.sequence - b.sequence)

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {sorted.map((c, idx) => (
        <span key={c.id} className="inline-flex items-center gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
            {CATEGORY_LABEL[c.categoryType]}
          </span>
          {idx < sorted.length - 1 && <span className="text-muted-foreground">→</span>}
        </span>
      ))}
    </div>
  )
}
