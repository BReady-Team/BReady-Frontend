import type { PropsWithChildren } from 'react'
import Header from './Header'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
    </>
  )
}
