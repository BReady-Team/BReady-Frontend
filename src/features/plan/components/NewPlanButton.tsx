import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewPlanButton() {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate('/plans/new')} className="gap-2">
      <Plus className="h-4 w-4" />
      New Plan
    </Button>
  )
}
