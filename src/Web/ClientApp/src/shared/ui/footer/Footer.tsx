interface Props {
  vol?: string
  no?: string
  url?: string
}

export default function Footer({ vol = 'VOL. 1', no = 'NO. 014', url = 'ganihuhstack.dev' }: Props) {
  return (
    <footer className="w-full border-t-[3px] border-ink pt-4 flex justify-between items-baseline gap-4 flex-wrap">
      <span className="font-mono text-[12px] tracking-[0.04em] uppercase text-ink-muted">{vol} — {no}</span>
      <span className="font-mono text-[12px] tracking-[0.04em] uppercase text-ink">{url}</span>
    </footer>
  )
}
