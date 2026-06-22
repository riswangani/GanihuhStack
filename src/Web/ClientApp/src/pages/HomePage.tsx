import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getBlogPosts, type BlogPostDto } from '@/services/blogPosts'
import Headline from '@/components/content/Headline'
import SectionHeading from '@/components/content/SectionHeading'
import ArticleMeta from '@/components/content/ArticleMeta'
import Badge from '@/components/core/Badge'
import Button from '@/components/core/Button'
import Divider from '@/components/core/Divider'
import Tag from '@/components/core/Tag'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

function tagsOf(post: BlogPostDto) {
  return post.tags?.split(',').map(t => t.trim().toUpperCase()).filter(Boolean) ?? []
}

const STATIC_PROJECTS = [
  { name: 'GanihuhStack', year: '2024', desc: 'Platform blog personal dengan clean architecture, .NET Aspire, React 19, dan PostgreSQL.', stack: ['C#', 'React', 'PostgreSQL'] },
  { name: 'Auth Module',  year: '2024', desc: 'Modul autentikasi self-hosted dengan JWT, refresh token rotation, dan rate limiting.',       stack: ['ASP.NET Core', 'EF Core', 'Identity'] },
]

export default function HomePage() {
  const { data: posts = [] } = useQuery({ queryKey: ['blogPosts'], queryFn: getBlogPosts })
  const published = posts.filter(p => p.isPublished)
  const featured  = published[0]
  const sideList  = published.slice(1, 4)

  return (
    <div>
      {/* Hero */}
      <div className="grid grid-cols-[1.5fr_1px_1fr] gap-x-11 items-start pb-11 max-sm:grid-cols-1 max-sm:[&>[role=separator]]:hidden">
        <div>
          <span className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted">
            Pengembang perangkat lunak · Indonesia
          </span>
          <Headline size="xl" as="h1" className="mt-4 max-w-[12ch]">
            Gani — membangun hal-hal yang awet
          </Headline>
          <p className="font-sans text-base leading-[1.7] text-ink-body mt-[18px] max-w-[46ch]">
            Backend engineer yang menulis tentang clean architecture, ketekunan, dan proses di balik produk yang dibangun pelan-pelan. Ini jurnal kerja saya, terbuka untuk dibaca.
          </p>
        </div>
        <Divider orientation="v" />
        <aside className="bg-surface-sunken p-[22px] rounded-[4px]">
          <div className="flex justify-between items-center mb-[14px]">
            <span className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted">Sekarang</span>
            <Badge>21 JUN</Badge>
          </div>
          <p className="font-serif text-[20px] text-ink mb-3 leading-[1.3]">
            Membangun GanihuhStack dari nol
          </p>
          <Button variant="ghost" href="/now">Lihat fokus saat ini →</Button>
        </aside>
      </div>

      <Divider weight="hard" />
      <div className="h-10" />

      {/* Latest writing */}
      <SectionHeading className="mb-[26px]">Tulisan terbaru</SectionHeading>
      {published.length === 0 ? (
        <p className="font-sans text-base text-ink-muted">Belum ada tulisan.</p>
      ) : (
        <div className="grid grid-cols-[1.4fr_1px_1fr] gap-x-10 max-sm:grid-cols-1 max-sm:[&>[role=separator]]:hidden">
          {featured && (
            <article>
              <ArticleMeta categories={tagsOf(featured)} date={formatDate(featured.publishedDate ?? featured.created)} />
              <Link to="/blog" className="no-underline">
                <Headline size="lg" className="mt-4">{featured.title}</Headline>
              </Link>
              {featured.excerpt && (
                <p className="font-sans text-base leading-[1.7] text-ink-body mt-[14px]">{featured.excerpt}</p>
              )}
              <span className="font-mono text-[12px] text-ink-muted">{readingTime(featured.content)} menit baca</span>
            </article>
          )}
          <Divider orientation="v" />
          <div className="flex flex-col">
            {sideList.map((p, i) => (
              <>
                <Link key={p.id} to="/blog" className="flex flex-col gap-[5px] py-4 no-underline">
                  <span className="font-mono text-[11px] text-ink-muted">{formatDate(p.publishedDate ?? p.created)}</span>
                  <span className="font-serif text-[17px] text-ink leading-[1.3]">{p.title}</span>
                </Link>
                {i < sideList.length - 1 && <Divider />}
              </>
            ))}
          </div>
        </div>
      )}

      <div className="h-14" />
      <Divider weight="hard" />
      <div className="h-10" />

      {/* Selected projects — static until Projects endpoint exists */}
      <div className="flex justify-between items-baseline mb-[26px]">
        <SectionHeading>Proyek pilihan</SectionHeading>
        <Button variant="ghost" href="/projects">Semua proyek →</Button>
      </div>
      <div className="grid grid-cols-2 gap-px bg-ink/14 border border-ink/14 max-sm:grid-cols-1">
        {STATIC_PROJECTS.map((p, i) => (
          <div key={i} className="bg-paper p-6">
            <div className="flex justify-between items-baseline">
              <h3 className="font-sans text-base font-semibold text-ink m-0">{p.name}</h3>
              <span className="font-mono text-[11px] text-ink-muted">{p.year}</span>
            </div>
            <p className="font-sans text-sm leading-[1.7] text-ink-body my-2 mb-[14px]">{p.desc}</p>
            <div className="flex gap-2 flex-wrap">
              {p.stack.map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
