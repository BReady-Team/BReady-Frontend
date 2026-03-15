import type { CategoryType } from '@/types/plan'

const categoryLabels: Record<CategoryType, { label: string }> = {
  MEAL: { label: '식사' },
  CAFE: { label: '카페' },
  EXHIBITION: { label: '전시' },
  WALK: { label: '산책' },
  SHOPPING: { label: '쇼핑' },
  REST: { label: '휴식' },
}

interface TriggerCategoryStepProps {
  categoryType: CategoryType
  busy: boolean
  onChangeCategory: (type: CategoryType) => void
}

export default function TriggerCategoryStep({
  categoryType,
  busy,
  onChangeCategory,
}: TriggerCategoryStepProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">어떤 활동으로 변경할까요?</p>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(categoryLabels) as CategoryType[])
          .filter(t => t !== categoryType)
          .map(type => (
            <button
              key={type}
              disabled={busy}
              onClick={() => onChangeCategory(type)}
              className="rounded-xl border border-border/50 p-4 hover:bg-secondary/50 disabled:opacity-60"
            >
              <p className="text-sm font-medium">{categoryLabels[type].label}</p>
            </button>
          ))}
      </div>
    </>
  )
}
