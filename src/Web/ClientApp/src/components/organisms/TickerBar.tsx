interface Props {
  items: string[]
}

export default function TickerBar({ items }: Props) {
  return (
    <div className="w-full py-[10px] flex overflow-x-auto no-scrollbar gap-2 whitespace-nowrap sm:flex-wrap sm:justify-between">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center bg-ticker-bg text-ticker-ink px-[13px] py-[7px] rounded-[2px] font-sans text-[11px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0">
          {it}
        </span>
      ))}
    </div>
  )
}
