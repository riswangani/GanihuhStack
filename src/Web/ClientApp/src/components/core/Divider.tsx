import { cn } from '@/lib/utils'

interface Props {
  weight?: 'hair' | 'hard'
  orientation?: 'h' | 'v'
  className?: string
}

export default function Divider({ weight = 'hair', orientation = 'h', className }: Props) {
  if (orientation === 'v') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch', weight === 'hard' ? 'bg-ink' : 'bg-ink/10', className)}
      />
    )
  }
  return (
    <hr className={cn('border-none m-0 w-full', weight === 'hard' ? 'h-[3px] bg-ink' : 'h-px bg-ink/14', className)} />
  )
}
