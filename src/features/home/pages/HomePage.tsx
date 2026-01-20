import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-hidden relative cursor-default">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background:
              'linear-gradient(135deg, oklch(0.72 0.14 178) 0%, oklch(0.65 0.12 190) 100%)',
          }}
        />

        <div
          className="absolute -bottom-48 -right-32 w-[700px] h-[700px] rounded-full blur-[150px] opacity-15"
          style={{
            background:
              'linear-gradient(315deg, oklch(0.72 0.14 178) 0%, oklch(0.60 0.10 200) 100%)',
          }}
        />

        <div
          className="absolute w-[800px] h-[800px] rounded-full transition-transform duration-[1500ms] ease-out"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.14 178 / 0.12) 0%, transparent 60%)',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px))`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.72 0.14 178) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.14 178) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-[-0.04em] leading-[0.85] bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(135deg, oklch(0.95 0 0) 0%, oklch(0.72 0.14 178) 50%, oklch(0.65 0.12 190) 100%)',
          }}
        >
          BReady
        </h1>

        <p className="mt-8 text-lg md:text-xl text-foreground/50 font-light tracking-tight">
          예상 밖의 순간까지 담은 일정
        </p>

        <Link
          to={isLoggedIn ? '/plans' : '/login'}
          className="mt-16 inline-flex items-center gap-3 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
        >
          시작하기 →
        </Link>
      </main>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 text-xs">
        <span className="tracking-widest text-primary/55">PLAN</span>
        <span className="w-8 h-px bg-primary/40" />
        <span className="tracking-widest text-foreground/45">TRIGGER</span>
        <span className="w-8 h-px bg-primary/40" />
        <span className="tracking-widest text-primary/55">FLOW</span>
      </div>

      <div className="fixed bottom-8 right-8 text-[10px] text-foreground/35 tracking-widest">
        © 2026
      </div>

      <div className="fixed bottom-8 left-8 flex items-center gap-2">
        <div className="w-12 h-px bg-gradient-to-r from-primary/55 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/45" />
      </div>
    </div>
  )
}
