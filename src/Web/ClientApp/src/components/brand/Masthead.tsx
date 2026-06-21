import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Props {
  name?: string
  left?: string | string[]
  right?: string | string[]
  to?: string
  className?: string
}

function Cell({ text, divider }: { text: string; divider: boolean }) {
  return (
    <span className={cn(
      'flex items-center px-[18px]',
      'font-sans text-eyebrow font-medium tracking-[0.08em] uppercase text-ink-muted whitespace-nowrap',
      divider && 'border-l border-ink/14',
    )}>
      {text}
    </span>
  )
}

export default function Masthead({
  name = 'GANIHUHSTACK',
  left = ['GANI', 'DEV'],
  right = ['EST. 2024', 'NO. 014'],
  to = '/',
  className,
}: Props) {
  const leftItems = Array.isArray(left) ? left : [left]
  const rightItems = Array.isArray(right) ? right : [right]
  return (
    <header className={cn('w-full border-t border-ink/14 border-b-[3px] border-b-ink', className)}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
        <div className="flex justify-end border-r border-ink/14">
          {leftItems.map((it, i) => <Cell key={i} text={it} divider={i > 0} />)}
        </div>
        <Link
          to={to}
          className="font-sans font-bold text-masthead tracking-[0.05em] text-ink uppercase no-underline leading-none text-center whitespace-nowrap px-8 py-[22px] self-center"
        >
          {name}
        </Link>
        <div className="flex justify-start border-l border-ink/14">
          {rightItems.map((it, i) => <Cell key={i} text={it} divider={i > 0} />)}
        </div>
      </div>
    </header>
  )
}
