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
  recommendCategory?: CategoryType
  recommendReason?: string
  onChangeCategory: (type: CategoryType) => void
  onRecommendClick: () => void
}

export default function TriggerCategoryStep({
  categoryType,
  busy,
  isAiLoading,
  recommendCategory,
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
        <p className="text-sm text-muted-foreground">
          AI 추천 버튼을 눌러 추천 카테고리를 받아오세요.
        </p>
      )}

      {recommendCategory && recommendReason && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">AI 추천 활동</span>
          </div>

          <div className="mb-3 rounded-lg bg-background px-4 py-3 text-center border border-border/50">
            <p className="text-lg font-semibold text-primary">
              {categoryLabels[recommendCategory].label}
            </p>
          </div>

          {recommendReason && (
            <div className="rounded-lg bg-secondary/40 px-3 py-2">
              <p className="text-xs text-muted-foreground mb-1">추천 이유</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{recommendReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
