import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProject, updateProject, deleteProject,
  type ProjectDto, type CreateProjectRequest,
} from '@/features/projects'
import { cn } from '@/shared/lib/utils'

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

interface ProjectFormState {
  name: string
  description: string
  technologies: string
  repositoryUrl: string
  demoUrl: string
  isFeatured: boolean
}

const EMPTY_PROJECT: ProjectFormState = {
  name: '', description: '', technologies: '', repositoryUrl: '', demoUrl: '', isFeatured: false,
}

const fromProject = (p: ProjectDto): ProjectFormState => ({
  name: p.name, description: p.description ?? '', technologies: p.technologies ?? '',
  repositoryUrl: p.repositoryUrl ?? '', demoUrl: p.demoUrl ?? '', isFeatured: p.isFeatured,
})

export default function ProjectsManagementTab({
  projects, isLoading, qc
}: {
  projects: ProjectDto[]
  isLoading: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [form, setForm] = useState<ProjectFormState>(EMPTY_PROJECT)
  const [editing, setEditing] = useState<ProjectDto | null>(null)
  const [showForm, setShow] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['projects'] })

  const createMut = useMutation({ mutationFn: createProject, onSuccess: () => { invalidate(); closeForm() } })
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: CreateProjectRequest }) => updateProject(id, data), onSuccess: () => { invalidate(); closeForm() } })
  const deleteMut = useMutation({ mutationFn: deleteProject, onSuccess: invalidate })

  function openCreate() { setEditing(null); setForm(EMPTY_PROJECT); setShow(true) }
  function openEdit(p: ProjectDto) { setEditing(p); setForm(fromProject(p)); setShow(true) }
  function closeForm() { setShow(false); setEditing(null); setForm(EMPTY_PROJECT) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: CreateProjectRequest = {
      name: form.name,
      description: form.description || undefined,
      technologies: form.technologies || undefined,
      repositoryUrl: form.repositoryUrl || undefined,
      demoUrl: form.demoUrl || undefined,
      isFeatured: form.isFeatured,
    }
    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload })
    } else {
      createMut.mutate(payload)
    }
  }

  function handleDelete(p: ProjectDto) {
    if (!window.confirm(`Hapus proyek "${p.name}"?`)) return
    deleteMut.mutate(p.id)
  }

  const set = (patch: Partial<ProjectFormState>) => setForm({ ...form, ...patch })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans text-base font-semibold text-ink">Kelola Proyek Portfolio</h2>
        {!showForm && (
          <button onClick={openCreate} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-4 py-2 rounded-[2px] hover:opacity-85 transition-opacity">
            + Tambah Proyek
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-ink/14 rounded-[2px] p-6 mb-8 bg-surface">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-[18px] font-bold text-ink">{editing ? 'Edit Proyek' : 'Proyek Baru'}</h3>
            <button onClick={closeForm} className="font-sans text-sm text-ink-muted hover:text-ink">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nama Proyek *">
              <input value={form.name} onChange={e => set({ name: e.target.value })} required className={inputCls} placeholder="Nama proyek" />
            </Field>
            <Field label="Deskripsi">
              <textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} className={inputCls} placeholder="Jelaskan detail proyek..." />
            </Field>
            <Field label="Teknologi">
              <input value={form.technologies} onChange={e => set({ technologies: e.target.value })} className={inputCls} placeholder="React, C#, PostgreSQL (pisahkan dengan koma)" />
            </Field>
            <Field label="URL Repositori (GitHub)">
              <input type="url" value={form.repositoryUrl} onChange={e => set({ repositoryUrl: e.target.value })} className={inputCls} placeholder="https://github.com/..." />
            </Field>
            <Field label="URL Demo (Live Web)">
              <input type="url" value={form.demoUrl} onChange={e => set({ demoUrl: e.target.value })} className={inputCls} placeholder="https://..." />
            </Field>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set({ isFeatured: e.target.checked })} className="w-4 h-4 accent-ink" />
              <span className="font-sans text-sm text-ink">Featured Project (Tampilkan Utama)</span>
            </label>
            {(createMut.isError || updateMut.isError) && <p className="font-sans text-sm text-red-600">Gagal menyimpan data.</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2.5 rounded-[2px] hover:opacity-85 disabled:opacity-40 transition-opacity">
                {createMut.isPending || updateMut.isPending ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah Proyek'}
              </button>
              <button type="button" onClick={closeForm} className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted hover:text-ink">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="font-sans text-sm text-ink-muted py-8">Memuat proyek...</p>
      ) : projects.length === 0 ? (
        <p className="font-sans text-sm text-ink-muted py-8 bg-surface-sunken text-center rounded-[2px]">Belum ada proyek terdaftar.</p>
      ) : (
        <div className="border border-ink/14 rounded-[2px] overflow-hidden">
          {projects.map((proj, i) => (
            <div key={proj.id} className={cn('flex items-center justify-between gap-4 px-5 py-4 bg-surface', i < projects.length - 1 && 'border-b border-ink/14')}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('font-sans text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-[2px] rounded-[2px]', proj.isFeatured ? 'bg-accent text-accent-ink' : 'bg-surface-sunken text-ink-muted')}>
                    {proj.isFeatured ? 'Featured' : 'Regular'}
                  </span>
                </div>
                <p className="font-sans text-sm font-medium text-ink truncate">{proj.name}</p>
                <p className="font-mono text-[11px] text-ink-faint mt-[2px]">{proj.technologies || 'No technologies'}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => openEdit(proj)} className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(proj)} disabled={deleteMut.isPending} className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-red-600 disabled:opacity-40">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
