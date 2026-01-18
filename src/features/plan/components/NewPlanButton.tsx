import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function NewPlanButton() {
  return (
    <Link
      to="/plans/new"
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
    >
      <Plus className="h-4 w-4" />
      New Plan
    </Link>
  )
}
