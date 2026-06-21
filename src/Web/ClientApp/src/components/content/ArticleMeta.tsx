import { cn } from '@/lib/utils'

interface Props {
  categories?: string[]
  date?: string
  className?: string
}

export default function ArticleMeta({ categories = [], date, className }: Props) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center gap-4 pb-[10px]">
        <div className="flex gap-5 flex-wrap">
          {categories.map((c, i) => (
            <span key={i} className="font-sans text-eyebrow font-semibold tracking-[0.08em] uppercase text-ink">
              {c}
            </span>
          ))}
        </div>
        {date && (
          <span className="inline-flex items-center px-[9px] py-1 rounded-[2px] bg-accent text-accent-ink font-sans text-[11px] font-semibold tracking-[0.07em] uppercase leading-none whitespace-nowrap shrink-0">
            {date}
          </span>
        )}
      </div>
      <div className="relative h-[2px] bg-ink/14">
        <div className="absolute left-0 top-0 h-[2px] w-24 bg-accent-line" />
      </div>
    </div>
  )
}
