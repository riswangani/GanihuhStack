interface RowItemProps {
  date: string
  title: string
  meta?: string
  href?: string
  children?: React.ReactNode
}

export default function RowItem({ date, title, meta, href, children }: RowItemProps) {
  return (
    <div className="grid grid-cols-[130px_1fr] max-sm:grid-cols-1 gap-4 sm:gap-6 py-2.5 items-baseline">
      <span className="font-sans text-sm text-ink-muted shrink-0">{date}</span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-sm font-semibold text-ink hover:text-ink-muted no-underline border-b border-ink/30 hover:border-ink transition-colors"
            >
              {title} ↗
            </a>
          ) : (
            <span className="font-sans text-sm font-semibold text-ink">{title}</span>
          )}
          {meta && <span className="font-sans text-xs text-ink-muted">· {meta}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}
