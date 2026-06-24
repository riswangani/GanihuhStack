import { useQuery } from '@tanstack/react-query'
import { getBlogPosts, type BlogPostDto } from '@/services/blogPosts'
import Headline from '@/components/content/Headline'
import ArticleMeta from '@/components/content/ArticleMeta'
import Divider from '@/components/core/Divider'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

function PostRow({ post }: { post: BlogPostDto }) {
  const tags = post.tags?.split(',').map(t => t.trim().toUpperCase()).filter(Boolean) ?? []
  return (
    <article className="grid grid-cols-[120px_1fr] gap-x-7 items-start max-sm:grid-cols-1">
      <div className="flex flex-col gap-[10px] items-start pt-[2px]">
        <span className="font-mono text-[12px] text-ink-muted">
          {formatDate(post.publishedDate ?? post.created)}
        </span>
        {tags[0] && (
          <span className="inline-flex items-center px-[9px] py-1 rounded-[2px] bg-accent text-accent-ink font-sans text-[11px] font-semibold tracking-[0.07em] uppercase leading-none whitespace-nowrap">
            {tags[0]}
          </span>
        )}
      </div>
      <div>
        <ArticleMeta categories={tags.slice(1)} />
        <Headline size="lg" to={`/blog/${post.slug}`} className="mt-[10px]">{post.title}</Headline>
        {post.excerpt && (
          <p className="font-sans text-base leading-[1.7] text-ink-body mt-3 max-w-[56ch]">{post.excerpt}</p>
        )}
        <span className="font-mono text-[12px] text-ink-muted">{readingTime(post.content)} menit baca</span>
      </div>
    </article>
  )
}

export default function JurnalPage() {
  const { data: posts, isLoading, isError } = useQuery({ queryKey: ['blogPosts'], queryFn: getBlogPosts })

  if (isLoading) return <p className="text-ink-muted py-12 text-sm">Memuat...</p>
  if (isError)   return <p className="text-ink-muted py-12 text-sm">Gagal memuat tulisan.</p>

  const published = posts?.filter(p => p.isPublished) ?? []

  return (
    <div>
      <span className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted">
        Yapping · Semua tulisan
      </span>
      <div className="h-7" />
      {published.length === 0 && (
        <p className="font-sans text-base text-ink-muted">Belum ada tulisan.</p>
      )}
      {published.map((post, i) => (
        <>
          <PostRow key={post.id} post={post} />
          {i < published.length - 1 && <div className="py-8"><Divider /></div>}
        </>
      ))}
    </div>
  )
}
