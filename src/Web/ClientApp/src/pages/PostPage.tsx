import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBlogPostBySlug } from '@/services/blogPosts'
import Headline from '@/components/content/Headline'
import ArticleMeta from '@/components/content/ArticleMeta'
import Divider from '@/components/core/Divider'
import { buttonVariants } from '@/components/core/Button'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <p className="text-ink-muted py-12 text-sm">Memuat...</p>
  if (isError || !post) return <p className="text-ink-muted py-12 text-sm">Tulisan tidak ditemukan.</p>

  const tags = post.tags?.split(',').map(t => t.trim().toUpperCase()).filter(Boolean) ?? []
  const date = formatDate(post.publishedDate ?? post.created)
  // ponytail: plain-text paragraphs; swap for markdown renderer when content format is settled
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean)

  return (
    <article className="max-w-[680px] mx-auto">
      <Link to="/blog" className={buttonVariants({ variant: 'ghost' })}>← Kembali ke jurnal</Link>

      <div className="h-5" />
      <ArticleMeta categories={tags} date={date} />

      <Headline size="xl" as="h1" className="mt-[18px]">{post.title}</Headline>
      <div className="h-3" />
      <span className="font-mono text-[12px] text-ink-muted">{readingTime(post.content)} menit baca</span>

      <div className="h-7" />
      <Divider />
      <div className="h-7" />

      <div className="space-y-[22px]">
        {paragraphs.map((p, i) => (
          <p key={i} className="font-sans text-[17px] leading-[1.8] text-ink-body">{p}</p>
        ))}
      </div>

      <div className="h-5" />
      <Divider />
      <p className="font-sans text-sm text-ink-muted mt-5">
        Ditulis oleh Gani. Ada tanggapan?{' '}
        <Link to="/contact" className="border-b border-ink text-ink-body no-underline hover:opacity-70 transition-opacity">
          Kirim pesan
        </Link>.
      </p>
    </article>
  )
}
