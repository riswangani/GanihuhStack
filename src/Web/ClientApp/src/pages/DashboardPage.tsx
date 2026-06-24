import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isLoggedIn } from '@/services/auth'
import {
  getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  type BlogPostDto, type CreateBlogPostRequest, type UpdateBlogPostRequest,
} from '@/services/blogPosts'
import { cn } from '@/lib/utils'

interface PostForm {
  title: string
  content: string
  excerpt: string
  tags: string
  slug: string
  isPublished: boolean
}

const EMPTY: PostForm = { title: '', content: '', excerpt: '', tags: '', slug: '', isPublished: false }

const fromPost = (p: BlogPostDto): PostForm => ({
  title: p.title, content: p.content,
  excerpt: p.excerpt ?? '', tags: p.tags ?? '',
  slug: p.slug, isPublished: p.isPublished,
})

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

function PostForm({
  form, editing, isPending, isError,
  onChange, onSubmit, onCancel,
}: {
  form: PostForm
  editing: boolean
  isPending: boolean
  isError: boolean
  onChange: (f: PostForm) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  const set = (patch: Partial<PostForm>) => onChange({ ...form, ...patch })
  return (
    <div className="border border-ink/14 rounded-[2px] p-6 mb-8 bg-surface">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-sans text-base font-semibold text-ink">
          {editing ? 'Edit Post' : 'Post Baru'}
        </h2>
        <button onClick={onCancel} className="font-sans text-sm text-ink-muted hover:text-ink">Batal</button>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Judul *">
          <input value={form.title} onChange={e => set({ title: e.target.value })}
            required className={inputCls} placeholder="Judul post" />
        </Field>
        <Field label="Konten *">
          <textarea value={form.content} onChange={e => set({ content: e.target.value })}
            required rows={12} className={cn(inputCls, 'font-mono text-sm resize-y')}
            placeholder="Tulis konten di sini..." />
        </Field>
        <Field label="Excerpt">
          <textarea value={form.excerpt} onChange={e => set({ excerpt: e.target.value })}
            rows={2} className={cn(inputCls, 'resize-none')}
            placeholder="Ringkasan singkat (opsional)" />
        </Field>
        <Field label="Tags">
          <input value={form.tags} onChange={e => set({ tags: e.target.value })}
            className={inputCls} placeholder="dotnet, architecture (pisahkan dengan koma)" />
        </Field>
        {editing && (
          <Field label="Slug">
            <input value={form.slug} disabled
              className={cn(inputCls, 'opacity-50 cursor-not-allowed bg-surface-sunken')} />
          </Field>
        )}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.isPublished}
            onChange={e => set({ isPublished: e.target.checked })}
            className="w-4 h-4 accent-ink" />
          <span className="font-sans text-sm text-ink">Publish now</span>
        </label>
        {isError && <p className="font-sans text-sm text-red-600">Failed to save. Please try again.</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={isPending}
            className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-5 py-2 rounded-[2px] hover:opacity-80 disabled:opacity-40 transition-opacity">
            {isPending ? 'Saving...' : editing ? 'Save' : 'Create Post'}
          </button>
          <button type="button" onClick={onCancel}
            className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted hover:text-ink">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default function DashboardPage() {
  const navigate   = useNavigate()
  const qc         = useQueryClient()
  const [form, setForm]       = useState<PostForm>(EMPTY)
  const [editing, setEditing] = useState<BlogPostDto | null>(null)
  const [showForm, setShow]   = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login', { replace: true })
  }, [navigate])

  const { data: posts = [], isLoading } = useQuery({ queryKey: ['blogPosts'], queryFn: getBlogPosts })
  const invalidate = () => qc.invalidateQueries({ queryKey: ['blogPosts'] })

  const createMut = useMutation({ mutationFn: createBlogPost,                                  onSuccess: () => { invalidate(); close() } })
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: UpdateBlogPostRequest }) => updateBlogPost(id, data), onSuccess: () => { invalidate(); close() } })
  const deleteMut = useMutation({ mutationFn: deleteBlogPost, onSuccess: invalidate })

  function openCreate() { setEditing(null); setForm(EMPTY); setShow(true) }
  function openEdit(p: BlogPostDto) { setEditing(p); setForm(fromPost(p)); setShow(true) }
  function close() { setShow(false); setEditing(null); setForm(EMPTY) }

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
      const req: CreateBlogPostRequest = {
        title: form.title, content: form.content,
        excerpt: form.excerpt || undefined, tags: form.tags || undefined,
      }
      createMut.mutate(req)
    }
  }

  function handleDelete(p: BlogPostDto) {
    if (!window.confirm(`Hapus "${p.title}"?`)) return
    deleteMut.mutate(p.id)
  }

  if (!isLoggedIn()) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-xl font-semibold text-ink">Dashboard</h1>
          <p className="font-sans text-sm text-ink-muted mt-1">Kelola konten blog</p>
        </div>
        {!showForm && (
          <button onClick={openCreate}
            className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase bg-ink text-paper px-4 py-2 rounded-[2px] hover:opacity-80 transition-opacity">
            + Tulis Post
          </button>
        )}
      </div>

      {showForm && (
        <PostForm
          form={form} editing={!!editing}
          isPending={createMut.isPending || updateMut.isPending}
          isError={createMut.isError || updateMut.isError}
          onChange={setForm} onSubmit={handleSubmit} onCancel={close}
        />
      )}

      {isLoading ? (
        <p className="font-sans text-sm text-ink-muted py-8">Memuat...</p>
      ) : posts.length === 0 ? (
        <p className="font-sans text-sm text-ink-muted py-8">Belum ada post. Mulai tulis!</p>
      ) : (
        <div className="border border-ink/14 rounded-[2px] overflow-hidden">
          {posts.map((post, i) => (
            <div key={post.id} className={cn(
              'flex items-center justify-between gap-4 px-5 py-4',
              i < posts.length - 1 && 'border-b border-ink/14',
            )}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'font-sans text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-[2px] rounded-[2px]',
                    post.isPublished ? 'bg-accent text-accent-ink' : 'bg-surface-sunken text-ink-muted',
                  )}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="font-sans text-sm font-medium text-ink truncate">{post.title}</p>
                <p className="font-mono text-[11px] text-ink-faint mt-[2px]">{post.slug}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => openEdit(post)}
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(post)} disabled={deleteMut.isPending}
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-red-600 disabled:opacity-40">
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
