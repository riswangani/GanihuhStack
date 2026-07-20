import { useQuery } from '@tanstack/react-query'
import { getCurrentNowStatus } from '@/services/nowStatus'
import Headline from '@/components/content/Headline'
import SectionHeading from '@/components/content/SectionHeading'
import Divider from '@/components/core/Divider'
import Badge from '@/components/core/Badge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

export default function NowPage() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['nowStatus'],
    queryFn: getCurrentNowStatus,
  })

  if (isLoading) {
    return <p className="font-sans text-sm text-ink-muted">Memuat status...</p>
  }

  return (
    <div>
      <div className="flex flex-col gap-6 max-w-[700px] mx-auto pb-10">
        <div className="flex justify-between items-baseline border-b border-ink/14 pb-4">
          <Headline size="lg" as="h1">Sekarang</Headline>
          <span className="font-mono text-xs text-ink-muted">WHAT I'M DOING NOW</span>
        </div>

        {!status ? (
          <p className="font-sans text-base text-ink-muted py-8 text-center bg-surface-sunken rounded-[4px]">
            Belum ada update status terbaru dari Gani.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Focus Section */}
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

            <Divider />

            {/* Split Info: Reading & Mood */}
            <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
              {/* Reading */}
              {status.currentlyReading && (
                <section className="bg-surface-sunken p-5 rounded-[4px]">
                  <h3 className="font-sans text-xs font-semibold tracking-wider text-ink-muted uppercase mb-3">
                    Sedang Dibaca
                  </h3>
                  <p className="font-serif text-[18px] text-ink italic leading-snug">
                    {status.currentlyReading}
                  </p>
                </section>
              )}

              {/* Mood / Status */}
              {status.mood && (
                <section className="bg-surface-sunken p-5 rounded-[4px] flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans text-xs font-semibold tracking-wider text-ink-muted uppercase mb-3">
                      Mood / Keadaan
                    </h3>
                    <p className="font-serif text-[18px] text-ink leading-snug">
                      {status.mood}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <Divider />

            {/* Explanatory Footer */}
            <footer className="text-center font-sans text-xs text-ink-muted leading-relaxed mt-4">
              Halaman ini terinspirasi dari gerakan <a href="https://nownownow.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">nownownow.com</a>. Halaman ini memperlihatkan apa yang sedang saya fokuskan saat ini, bukan portofolio lengkap masa lalu saya.
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}
