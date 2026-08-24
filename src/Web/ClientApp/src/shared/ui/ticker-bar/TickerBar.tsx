interface Props {
  items: string[]
}

function Tag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center bg-ticker-bg text-ticker-ink px-[13px] py-[7px] rounded-[2px] font-sans text-[11px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0">
      {text}
    </span>
  )
}

export default function TickerBar({ items }: Props) {
  if (items.length === 0) return null


  return (
    <div className="w-full py-[10px] overflow-hidden">
      <div className="flex gap-2 w-max animate-[ticker-scroll_28s_linear_infinite] motion-reduce:animate-none hover:[animation-play-state:paused]">
        {[...items, ...items].map((it, i) => <Tag key={i} text={it} />)}
      </div>
    </div>
  )
}
