import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createBlogPost, updateBlogPost, deleteBlogPost,
  type BlogPostDto, type UpdateBlogPostRequest,
} from '@/features/blog'
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

export default function BlogManagementTab({
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
