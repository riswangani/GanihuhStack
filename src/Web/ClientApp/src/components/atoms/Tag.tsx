import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-[9px] py-[3px] rounded-[2px] bg-surface-sunken text-ink-body font-mono text-[12px] tracking-[0.01em] leading-[1.4] whitespace-nowrap', className)}>
      {children}
    </span>
  )
}
