import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  isAiLoading: boolean
  recommendReason?: string
  onChangeCategory: (type: CategoryType) => void
  onRecommendClick: () => void
}

export default function TriggerCategoryStep({
  categoryType,
  busy,
  isAiLoading,
  recommendReason,
  onChangeCategory,
  onRecommendClick,
}: TriggerCategoryStepProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">어떤 활동으로 변경할까요?</p>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(categoryLabels) as CategoryType[])
          .filter(type => type !== categoryType)
          .map(type => (
            <button
              key={type}
              disabled={busy}
              onClick={() => onChangeCategory(type)}
              className="flex items-center justify-center rounded-lg border border-border/50 p-4 text-sm font-medium hover:bg-secondary/50 disabled:opacity-60"
            >
              {categoryLabels[type].label}
            </button>
          ))}
      </div>

      <button
        type="button"
        onClick={onRecommendClick}
        disabled={busy || isAiLoading}
        className={cn(
          'flex w-full items-center justify-center gap-2',
          'h-12 rounded-lg text-sm font-medium',
          'bg-primary/10 text-primary border border-primary/20',
          'hover:bg-primary/20 transition-colors disabled:opacity-60',
        )}
      >
        <Sparkles className="h-4 w-4" />
        {isAiLoading ? '추천 중...' : 'AI 추천받기'}
      </button>

      {!isAiLoading && recommendReason == null && (
        <p className="text-sm text-muted-foreground">AI 추천 버튼을 눌러 추천 장소를 받아오세요.</p>
      )}

      {recommendReason && (
        <div className="mt-2 rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm">
          <p className="text-xs text-muted-foreground">추천 이유</p>
          <p className="text-sm">{recommendReason}</p>
        </div>
      )}
    </div>
  )
}
