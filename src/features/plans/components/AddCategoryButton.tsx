import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { CategoryType } from '@/types/plan'
import { cn } from '@/lib/utils'

interface AddCategoryButtonProps {
  onAdd: (type: CategoryType) => void
}

/* 카테고리 추가 버튼 -> 클릭 시 카테고리 선택 노출 */
export default function AddCategoryButton({ onAdd }: AddCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const CATEGORY_OPTIONS: { type: CategoryType; label: string }[] = [
    { type: 'MEAL', label: '식사' },
    { type: 'CAFE', label: '카페' },
    { type: 'EXHIBITION', label: '전시' },
    { type: 'WALK', label: '산책' },
    { type: 'SHOPPING', label: '쇼핑' },
    { type: 'REST', label: '휴식' },
  ]

  return (
    <div className="relative">
      {/* 메인 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex w-full items-center justify-center gap-2',
          'rounded-xl border border-dashed border-border/50 p-4',
          'text-sm text-muted-foreground',
          'transition-colors',
          'hover:border-primary/30 hover:text-primary hover:bg-primary/5',
        )}
      >
        <Plus className="h-4 w-4" />
        카테고리 추가
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* 드롭다운 패널 */}
          <div className="absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-lg">
            {CATEGORY_OPTIONS.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(type)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2',
                  'text-sm text-foreground',
                  'transition-colors',
                  'hover:bg-secondary',
                )}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {label[0]}
                </span>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
