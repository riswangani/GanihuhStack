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
      alert('"Now" status updated successfully!')
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
    return <p className="font-sans text-sm text-ink-muted py-8">Loading current status...</p>
  }

  return (
    <div className="border border-ink/14 rounded-[2px] p-6 bg-surface max-w-[650px]">
      <h2 className="font-sans text-base font-semibold text-ink mb-1">Update Now Status</h2>
      <p className="font-sans text-xs text-ink-muted mb-6">Each update saves a new history entry and is shown on the public /now page.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Current Main Focus *">
          <input value={focus} onChange={e => setFocus(e.target.value)} required className={inputCls} placeholder="e.g. Building the portfolio module in GanihuhStack" />
        </Field>
        <Field label="Additional Details (Markdown / Description)">
          <textarea value={details} onChange={e => setDetails(e.target.value)} rows={5} className={inputCls} placeholder="Describe what you're currently working on..." />
        </Field>
        <Field label="Currently Reading">
          <input value={reading} onChange={e => setReading(e.target.value)} className={inputCls} placeholder="Book Title (Author)" />
        </Field>
        <Field label="Mood / State">
          <input value={mood} onChange={e => setMood(e.target.value)} className={inputCls} placeholder="Productive, Relaxed, Motivated, etc." />
        </Field>

        {updateMut.isError && <p className="font-sans text-sm text-red-600">Failed to update status.</p>}

        <button type="submit" disabled={updateMut.isPending} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2.5 rounded-[2px] self-start hover:opacity-85 disabled:opacity-40 transition-opacity mt-2">
          {updateMut.isPending ? 'Updating...' : 'Save New Status'}
        </button>
      </form>
    </div>
  )
}
