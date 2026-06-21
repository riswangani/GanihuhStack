import { useQuery } from '@tanstack/react-query'
import { getBlogPosts, type BlogPostDto } from '../services/blogPosts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase()
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

function PostRow({ post }: { post: BlogPostDto }) {
  const tags = post.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? []
  return (
    <article className="post-row">
      <div className="post-header">
        <span className="post-date">{formatDate(post.publishedDate ?? post.created)}</span>
        {tags.map(tag => (
          <span key={tag} className="post-tag">{tag.toUpperCase()}</span>
        ))}
      </div>
      <h2 className="post-title">{post.title}</h2>
      {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
      <span className="post-read-time">{readingTime(post.content)} menit baca</span>
    </article>
  )
}

export default function JurnalPage() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
  })

  if (isLoading) return <p className="page-state">Memuat...</p>
  if (isError) return <p className="page-state">Gagal memuat tulisan.</p>

  return (
    <div className="jurnal-page">
      <p className="page-eyebrow">JURNAL · SEMUA TULISAN</p>
      {posts?.length === 0 && <p className="page-state">Belum ada tulisan.</p>}
      {posts?.map(post => <PostRow key={post.id} post={post} />)}
    </div>
  )
}
