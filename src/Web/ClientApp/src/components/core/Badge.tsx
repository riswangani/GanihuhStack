import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[2px] px-[9px] py-1 font-sans text-[11px] font-semibold tracking-[0.07em] uppercase leading-none whitespace-nowrap',
  {
    variants: {
      variant: {
        accent:  'bg-accent text-accent-ink',
        outline: 'bg-transparent text-ink border border-ink',
      },
    },
    defaultVariants: { variant: 'accent' },
  }
)

interface Props extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
}

export default function Badge({ children, variant, className }: Props) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
}
