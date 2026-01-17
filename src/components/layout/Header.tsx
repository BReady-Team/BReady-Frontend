import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-8 py-6 md:px-16">
        <Link
          to="/"
          className="text-sm font-medium tracking-tight text-foreground/70 hover:text-primary transition-colors"
        >
          BReady
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium tracking-tight text-foreground/70 hover:text-primary transition-colors"
        >
          Login
        </Link>
      </nav>
    </header>
  )
}
