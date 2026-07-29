import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateNowStatus,
  type NowStatusDto
} from '@/features/now-status'

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

export default function NowStatusManagementTab({
  currentStatus, isLoading, qc
}: {
  currentStatus: NowStatusDto | null | undefined
  isLoading: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [focus, setFocus] = useState(currentStatus?.currentFocus ?? '')
  const [details, setDetails] = useState(currentStatus?.details ?? '')
  const [reading, setReading] = useState(currentStatus?.currentlyReading ?? '')
  const [mood, setMood] = useState(currentStatus?.mood ?? '')
  const [prevStatus, setPrevStatus] = useState(currentStatus)

  // React 19 / Recommended Pattern: Sync state during render pass instead of useEffect
  if (currentStatus !== prevStatus) {
    setPrevStatus(currentStatus)
    setFocus(currentStatus?.currentFocus ?? '')
    setDetails(currentStatus?.details ?? '')
    setReading(currentStatus?.currentlyReading ?? '')
    setMood(currentStatus?.mood ?? '')
  }

  const updateMut = useMutation({
    mutationFn: updateNowStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nowStatus'] })
      qc.invalidateQueries({ queryKey: ['nowStatusHistory'] })
      alert('Status "Sekarang" berhasil diperbarui!')
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateMut.mutate({
      currentFocus: focus,
      details: details || undefined,
      currentlyReading: reading || undefined,
      mood: mood || undefined
    })
  }

  if (isLoading) {
    return <p className="font-sans text-sm text-ink-muted py-8">Memuat status saat ini...</p>
  }

  return (
    <div className="border border-ink/14 rounded-[2px] p-6 bg-surface max-w-[650px]">
      <h2 className="font-sans text-base font-semibold text-ink mb-1">Perbarui Status Sekarang</h2>
      <p className="font-sans text-xs text-ink-muted mb-6">Setiap pembaruan akan menyimpan riwayat status baru dan ditampilkan di halaman publik /now.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Fokus Utama Saat Ini *">
          <input value={focus} onChange={e => setFocus(e.target.value)} required className={inputCls} placeholder="Contoh: Membangun modul portofolio di GanihuhStack" />
        </Field>
        <Field label="Detail Tambahan (Markdown / Deskripsi)">
          <textarea value={details} onChange={e => setDetails(e.target.value)} rows={5} className={inputCls} placeholder="Tulis rincian aktivitas Anda saat ini..." />
        </Field>
        <Field label="Buku yang Sedang Dibaca">
          <input value={reading} onChange={e => setReading(e.target.value)} className={inputCls} placeholder="Judul Buku (Penulis)" />
        </Field>
        <Field label="Mood / Keadaan">
          <input value={mood} onChange={e => setMood(e.target.value)} className={inputCls} placeholder="Produktif, Santai, Semangat, dll." />
        </Field>

        {updateMut.isError && <p className="font-sans text-sm text-red-600">Gagal memperbarui status.</p>}
        
        <button type="submit" disabled={updateMut.isPending} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2.5 rounded-[2px] self-start hover:opacity-85 disabled:opacity-40 transition-opacity mt-2">
          {updateMut.isPending ? 'Memperbarui...' : 'Simpan Status Baru'}
        </button>
      </form>
    </div>
  )
}
