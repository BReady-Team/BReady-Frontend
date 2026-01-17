import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </>
  )
}
