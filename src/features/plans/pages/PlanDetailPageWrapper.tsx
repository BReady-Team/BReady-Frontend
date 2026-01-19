import { useParams } from 'react-router-dom'
import PlanDetailPage from './PlanDetailPage'

export default function PlanDetailPageWrapper() {
  const { planId } = useParams<{ planId: string }>()
  return <PlanDetailPage key={planId} />
}
