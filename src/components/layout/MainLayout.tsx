import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function MainLayout() {
  return (
    <>
      <AppHeader />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  )
}
