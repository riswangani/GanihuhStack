import { SectionHeading, Badge } from '@/shared/ui'
import type { NowStatusDto } from '../api/nowStatus'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

interface ActiveFocusCardProps {
  status: NowStatusDto
}

export default function ActiveFocusCard({ status }: ActiveFocusCardProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-baseline">
        <SectionHeading>Fokus Utama</SectionHeading>
        <Badge className="font-mono text-[10px]">{formatDate(status.created)}</Badge>
      </div>
      <p className="font-serif text-[22px] leading-relaxed text-ink font-semibold">
        {status.currentFocus}
      </p>
      {status.details && (
        <p className="font-sans text-base leading-relaxed text-ink-body mt-2 whitespace-pre-line">
          {status.details}
        </p>
      )}
    </section>
  )
}
