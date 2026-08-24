import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSkill, deleteSkill, type SkillDto } from '@/features/skills'

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

export default function SkillsManagementTab({
  skills, isLoading, qc
}: {
  skills: SkillDto[]
  isLoading: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [name, setName] = useState('')

  const invalidate = () => qc.invalidateQueries({ queryKey: ['skills'] })

  const createMut = useMutation({
    mutationFn: createSkill,
    onSuccess: () => { invalidate(); setName('') }
  })
  const deleteMut = useMutation({ mutationFn: deleteSkill, onSuccess: invalidate })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createMut.mutate({ name: name.trim() })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-sans text-base font-semibold text-ink">Manage Skills (Masthead Ticker)</h2>
        <p className="font-sans text-xs text-ink-muted mt-1">Skills here appear as a scrolling ticker below the masthead on every page.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className={inputCls}
          placeholder="e.g. TYPESCRIPT"
          maxLength={100}
        />
        <button
          type="submit"
          disabled={createMut.isPending || !name.trim()}
          className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2.5 rounded-[2px] hover:opacity-85 disabled:opacity-40 transition-opacity shrink-0"
        >
          {createMut.isPending ? 'Adding...' : '+ Add Skill'}
        </button>
      </form>

      {createMut.isError && <p className="font-sans text-sm text-red-600 -mt-5 mb-6">Failed to add skill.</p>}

      {isLoading ? (
        <p className="font-sans text-sm text-ink-muted py-8">Loading skills...</p>
      ) : skills.length === 0 ? (
        <p className="font-sans text-sm text-ink-muted py-8 bg-surface-sunken text-center rounded-[2px]">No skills yet — the public ticker uses the default list until you add one.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-2 bg-ticker-bg text-ticker-ink pl-[13px] pr-2 py-[7px] rounded-[2px] font-sans text-[11px] font-medium tracking-[0.1em] uppercase"
            >
              {skill.name}
              <button
                onClick={() => deleteMut.mutate(skill.id)}
                disabled={deleteMut.isPending}
                aria-label={`Delete ${skill.name}`}
                className="text-ticker-ink/60 hover:text-ticker-ink disabled:opacity-40 leading-none text-[14px]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
