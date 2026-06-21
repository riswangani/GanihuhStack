import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('m-0 font-sans text-section font-medium text-ink tracking-[0.005em]', className)}>
      {children}
    </h2>
  )
}
