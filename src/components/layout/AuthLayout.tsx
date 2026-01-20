import { Outlet } from 'react-router-dom'
import PublicHeader from './PublicHeader'

export default function AuthLayout() {
  return (
    <>
      <PublicHeader />
      <main>
        <Outlet />
      </main>
    </>
  )
}
