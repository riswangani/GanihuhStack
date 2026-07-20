import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isLoggedIn } from '@/services/auth'
import {
  getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  type BlogPostDto, type UpdateBlogPostRequest,
} from '@/services/blogPosts'
import {
  getProjects, createProject, updateProject, deleteProject,
  type ProjectDto, type CreateProjectRequest
} from '@/services/projects'
import {
  getCurrentNowStatus, updateNowStatus,
  type NowStatusDto
} from '@/services/nowStatus'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UTILITIES & COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

interface PostFormState {
  title: string
  content: string
  excerpt: string
  tags: string
  slug: string
  isPublished: boolean
}

const EMPTY_POST: PostFormState = { title: '', content: '', excerpt: '', tags: '', slug: '', isPublished: false }

const fromPost = (p: BlogPostDto): PostFormState => ({
  title: p.title, content: p.content,
  excerpt: p.excerpt ?? '', tags: p.tags ?? '',
  slug: p.slug, isPublished: p.isPublished,
})

function BlogPostSection({
  posts, isLoading, qc
}: {
  posts: BlogPostDto[]
  isLoading: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [form, setForm] = useState<PostFormState>(EMPTY_POST)
  const [editing, setEditing] = useState<BlogPostDto | null>(null)
  const [showForm, setShow] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['blogPosts'] })

  const createMut = useMutation({ mutationFn: createBlogPost, onSuccess: () => { invalidate(); closeForm() } })
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: UpdateBlogPostRequest }) => updateBlogPost(id, data), onSuccess: () => { invalidate(); closeForm() } })
  const deleteMut = useMutation({ mutationFn: deleteBlogPost, onSuccess: invalidate })

  function openCreate() { setEditing(null); setForm(EMPTY_POST); setShow(true) }
  function openEdit(p: BlogPostDto) { setEditing(p); setForm(fromPost(p)); setShow(true) }
  function closeForm() { setShow(false); setEditing(null); setForm(EMPTY_POST) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      updateMut.mutate({
        id: editing.id,
        data: {
          title: form.title, content: form.content,
          excerpt: form.excerpt || undefined, tags: form.tags || undefined,
          isPublished: form.isPublished,
        },
      })
    } else {
      createMut.mutate({
        title: form.title, content: form.content,
        excerpt: form.excerpt || undefined, tags: form.tags || undefined,
      })
    }
  }

  function handleDelete(p: BlogPostDto) {
    if (!window.confirm(`Hapus "${p.title}"?`)) return
    deleteMut.mutate(p.id)
  }

  const set = (patch: Partial<PostFormState>) => setForm({ ...form, ...patch })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans text-base font-semibold text-ink">Kelola Tulisan Blog</h2>
        {!showForm && (
          <button onClick={openCreate} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-4 py-2 rounded-[2px] hover:opacity-85 transition-opacity">
            + Tulis Post
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-ink/14 rounded-[2px] p-6 mb-8 bg-surface">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-[18px] font-bold text-ink">{editing ? 'Edit Post' : 'Post Baru'}</h3>
            <button onClick={closeForm} className="font-sans text-sm text-ink-muted hover:text-ink">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Judul *">
              <input value={form.title} onChange={e => set({ title: e.target.value })} required className={inputCls} placeholder="Judul post" />
            </Field>
            <Field label="Konten *">
              <textarea value={form.content} onChange={e => set({ content: e.target.value })} required rows={10} className={cn(inputCls, 'font-mono text-sm resize-y')} placeholder="Tulis konten di sini..." />
            </Field>
            <Field label="Excerpt">
              <textarea value={form.excerpt} onChange={e => set({ excerpt: e.target.value })} rows={2} className={cn(inputCls, 'resize-none')} placeholder="Ringkasan singkat (opsional)" />
            </Field>
            <Field label="Tags">
              <input value={form.tags} onChange={e => set({ tags: e.target.value })} className={inputCls} placeholder="dotnet, react, architecture" />
            </Field>
            {editing && (
              <Field label="Slug">
                <input value={form.slug} disabled className={cn(inputCls, 'opacity-50 cursor-not-allowed bg-surface-sunken')} />
              </Field>
            )}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.isPublished} onChange={e => set({ isPublished: e.target.checked })} className="w-4 h-4 accent-ink" />
              <span className="font-sans text-sm text-ink">Publish now</span>
            </label>
            {(createMut.isError || updateMut.isError) && <p className="font-sans text-sm text-red-600">Gagal menyimpan data.</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2.5 rounded-[2px] hover:opacity-85 disabled:opacity-40 transition-opacity">
                {createMut.isPending || updateMut.isPending ? 'Menyimpan...' : editing ? 'Simpan' : 'Buat Post'}
              </button>
              <button type="button" onClick={closeForm} className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted hover:text-ink">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="font-sans text-sm text-ink-muted py-8">Memuat tulisan...</p>
      ) : posts.length === 0 ? (
        <p className="font-sans text-sm text-ink-muted py-8 bg-surface-sunken text-center rounded-[2px]">Belum ada postingan blog. Silakan buat postingan perdana!</p>
      ) : (
        <div className="border border-ink/14 rounded-[2px] overflow-hidden">
          {posts.map((post, i) => (
            <div key={post.id} className={cn('flex items-center justify-between gap-4 px-5 py-4 bg-surface', i < posts.length - 1 && 'border-b border-ink/14')}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('font-sans text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-[2px] rounded-[2px]', post.isPublished ? 'bg-accent text-accent-ink' : 'bg-surface-sunken text-ink-muted')}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="font-sans text-sm font-medium text-ink truncate">{post.title}</p>
                <p className="font-mono text-[11px] text-ink-faint mt-[2px]">{post.slug}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => openEdit(post)} className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(post)} disabled={deleteMut.isPending} className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-red-600 disabled:opacity-40">
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

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectFormState {
  name: string
  description: string
  technologies: string
  repositoryUrl: string
  demoUrl: string
  isFeatured: boolean
}

const EMPTY_PROJECT: ProjectFormState = { name: '', description: '', technologies: '', repositoryUrl: '', demoUrl: '', isFeatured: false }

const fromProject = (p: ProjectDto): ProjectFormState => ({
  name: p.name, description: p.description ?? '',
  technologies: p.technologies ?? '', repositoryUrl: p.repositoryUrl ?? '',
  demoUrl: p.demoUrl ?? '', isFeatured: p.isFeatured,
})

function ProjectsSection({
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

// ─────────────────────────────────────────────────────────────────────────────
// NOW STATUS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function NowStatusSection({
  currentStatus, isLoading, qc
}: {
  currentStatus: NowStatusDto | null | undefined
  isLoading: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [focus, setFocus] = useState('')
  const [details, setDetails] = useState('')
  const [reading, setReading] = useState('')
  const [mood, setMood] = useState('')

  // Sync state with current status when page loads or status updates
  useEffect(() => {
    if (currentStatus) {
      setFocus(currentStatus.currentFocus)
      setDetails(currentStatus.details ?? '')
      setReading(currentStatus.currentlyReading ?? '')
      setMood(currentStatus.mood ?? '')
    }
  }, [currentStatus])

  const updateMut = useMutation({
    mutationFn: updateNowStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nowStatus'] })
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'now'>('blog')

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  // Queries
  const { data: posts = [], isLoading: loadingPosts } = useQuery({ queryKey: ['blogPosts'], queryFn: getBlogPosts })
  const { data: projects = [], isLoading: loadingProjects } = useQuery({ queryKey: ['projects'], queryFn: getProjects })
  const { data: currentStatus, isLoading: loadingNow } = useQuery({ queryKey: ['nowStatus'], queryFn: getCurrentNowStatus })

  if (!isLoggedIn()) return null

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-[32px] font-bold text-ink leading-snug">Dashboard Admin</h1>
          <p className="font-sans text-sm text-ink-muted mt-1">Kelola seluruh data portfolio dan konten personal Anda.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink/14 gap-2">
          <button
            onClick={() => setActiveTab('blog')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'blog' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'projects' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Proyek
          </button>
          <button
            onClick={() => setActiveTab('now')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'now' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Status Sekarang
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-2">
          {activeTab === 'blog' && (
            <BlogPostSection posts={posts} isLoading={loadingPosts} qc={qc} />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection projects={projects} isLoading={loadingProjects} qc={qc} />
          )}

          {activeTab === 'now' && (
            <NowStatusSection currentStatus={currentStatus} isLoading={loadingNow} qc={qc} />
          )}
        </div>
      </div>
    </div>
  )
}
