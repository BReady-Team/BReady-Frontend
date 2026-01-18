import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { User, BarChart2 } from 'lucide-react'

export default function AppHeader() {
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/plans"
          className="text-xl font-semibold tracking-tight bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          BReady
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/plans"
            className={cn(
              'px-4 py-2 text-sm rounded-md transition-colors',
              pathname.startsWith('/plans')
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            My Plans
          </Link>

          <Link
            to="/stats"
            className={cn(
              'px-4 py-2 text-sm rounded-md flex items-center gap-1.5 transition-colors',
              pathname === '/stats'
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BarChart2 className="h-4 w-4" />
            Stats
          </Link>
        </nav>

        <Link
          to="/mypage"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
            pathname === '/mypage'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
