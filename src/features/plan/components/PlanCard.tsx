import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight, MapPin } from 'lucide-react'
import type { PlanSummaryDTO } from '../types'
import { PlanCategoryChips } from './PlanCategoryChips'

interface Props {
  plan: PlanSummaryDTO
}

export function PlanCard({ plan }: Props) {
  return (
    <Link
      to={`/plans/${plan.id}`}
      className="group block w-full rounded-2xl border border-border/40 bg-card p-6 text-left shadow-sm transition-colors duration-200 hover:border-primary/60 hover:bg-secondary/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
            {plan.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {plan.planDate}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {plan.region}
            </span>
          </div>

          <PlanCategoryChips categories={plan.categories} />
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
      </div>
    </Link>
  )
}
