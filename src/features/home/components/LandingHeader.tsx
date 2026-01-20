import { Link } from 'react-router-dom'

export default function LandingHeader() {
  return (
    <header className="border-b border-border/40 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-semibold">BReady</span>

        <div className="flex gap-2">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            로그인
          </Link>
          <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
            회원가입
          </Link>
        </div>
      </div>
    </header>
  )
}
