import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projects'
import Headline from '@/components/content/Headline'
import Divider from '@/components/core/Divider'
import Tag from '@/components/core/Tag'

function formatTechStack(techStr: string | null) {
  return techStr?.split(',').map(t => t.trim()).filter(Boolean) ?? []
}

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const featured = projects.filter(p => p.isFeatured)
  const regular = projects.filter(p => !p.isFeatured)

  if (isLoading) {
    return <p className="font-sans text-sm text-ink-muted">Memuat daftar proyek...</p>
  }

  return (
    <div>
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex justify-between items-baseline border-b border-ink/14 pb-4">
          <Headline size="lg" as="h1">Proyek</Headline>
          <span className="font-mono text-xs text-ink-muted">PORTFOLIO & WORKPLAYGROUND</span>
        </div>

        {projects.length === 0 ? (
          <p className="font-sans text-base text-ink-muted py-8 text-center bg-surface-sunken rounded-[4px]">
            Belum ada proyek yang terdaftar saat ini.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Featured Projects */}
            {featured.length > 0 && (
              <section className="flex flex-col gap-6">
                <h2 className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {featured.map(p => (
                    <div key={p.id} className="border border-ink/14 rounded-[2px] p-6 bg-surface flex flex-col gap-4">
                      <div className="flex justify-between items-baseline max-sm:flex-col max-sm:gap-1">
                        <h3 className="font-serif text-[22px] font-semibold text-ink m-0">{p.name}</h3>
                        <div className="flex gap-4 font-mono text-xs text-ink-muted">
                          {p.repositoryUrl && (
                            <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                              GitHub
                            </a>
                          )}
                          {p.demoUrl && (
                            <a href={p.demoUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      {p.description && (
                        <p className="font-sans text-base leading-relaxed text-ink-body">
                          {p.description}
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {formatTechStack(p.technologies).map(t => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {featured.length > 0 && regular.length > 0 && <Divider />}

            {/* Regular Projects Grid */}
            {regular.length > 0 && (
              <section className="flex flex-col gap-6">
                <h2 className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">
                  Other Lab Experiments & Tools
                </h2>
                <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                  {regular.map(p => (
                    <div key={p.id} className="border border-ink/14 rounded-[2px] p-5 bg-surface-sunken flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-sans text-base font-semibold text-ink m-0">{p.name}</h3>
                          <div className="flex gap-3 font-mono text-[11px] text-ink-muted shrink-0">
                            {p.repositoryUrl && (
                              <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                                Code
                              </a>
                            )}
                            {p.demoUrl && (
                              <a href={p.demoUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                                Demo
                              </a>
                            )}
                          </div>
                        </div>
                        {p.description && (
                          <p className="font-sans text-sm leading-relaxed text-ink-body">
                            {p.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {formatTechStack(p.technologies).map(t => (
                          <Tag key={t} className="text-[10px] px-1.5 py-0.5">{t}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
