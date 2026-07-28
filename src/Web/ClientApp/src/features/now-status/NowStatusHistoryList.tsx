import SectionHeading from '@/components/molecules/SectionHeading'
import type { NowStatusDto } from './api/nowStatus'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

interface NowStatusHistoryListProps {
  history: NowStatusDto[]
}

export default function NowStatusHistoryList({ history }: NowStatusHistoryListProps) {
  if (history.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading>Riwayat Fokus Sebelumnya</SectionHeading>
      <div className="flex flex-col gap-6">
        {history.map((h) => (
          <div key={h.id} className="border-l-2 border-ink/20 pl-4 py-1 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-xs text-ink-muted">{formatDate(h.created)}</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-ink leading-snug">{h.currentFocus}</h4>
            {h.details && (
              <p className="font-sans text-xs text-ink-body leading-relaxed">{h.details}</p>
            )}
            {(h.currentlyReading || h.mood) && (
              <div className="flex gap-4 font-sans text-xs text-ink-muted mt-1">
                {h.currentlyReading && <span>📖 {h.currentlyReading}</span>}
                {h.mood && <span>💭 {h.mood}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
