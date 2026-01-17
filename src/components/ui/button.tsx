import type { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'outline'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ className = '', variant = 'default', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const size = 'h-11 px-4 py-2'
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border/50 bg-secondary/30 hover:bg-secondary/50',
  } as const

  return <button className={`${base} ${size} ${variants[variant]} ${className}`} {...props} />
}
