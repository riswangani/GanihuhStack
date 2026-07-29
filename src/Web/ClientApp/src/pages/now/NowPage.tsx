import { useQuery } from '@tanstack/react-query'
import { getCurrentNowStatus, getNowStatusHistory, ActiveFocusCard, NowStatusHistoryList } from '@/features/now-status'
import { Headline, Divider } from '@/shared/ui'

export default function NowPage() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['nowStatus'],
    queryFn: getCurrentNowStatus,
  })

  const { data: history = [] } = useQuery({
    queryKey: ['nowStatusHistory'],
    queryFn: getNowStatusHistory,
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
            <ActiveFocusCard status={status} />

            <Divider />

            {/* Split Info: Reading & Mood */}
            <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
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

            {history.length > 0 && (
              <>
                <Divider />
                <NowStatusHistoryList history={history} />
              </>
            )}

            <Divider />

            <footer className="text-center font-sans text-xs text-ink-muted leading-relaxed mt-4">
              Halaman ini terinspirasi dari gerakan <a href="https://nownownow.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">nownownow.com</a>. Halaman ini memperlihatkan apa yang sedang saya fokuskan saat ini, bukan portofolio lengkap masa lalu saya.
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}
