import { Plus } from 'lucide-react'

interface Props {
  onClick?: () => void
}

export function NewPlanButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
    >
      <Plus className="h-4 w-4" />
      New Plan
    </button>
  )
}
