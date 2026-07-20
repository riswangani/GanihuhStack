import Headline from '@/components/content/Headline'
import SectionHeading from '@/components/content/SectionHeading'
import Divider from '@/components/core/Divider'
import Tag from '@/components/core/Tag'

export default function AboutPage() {
  const stacks = {
    languages: ['C#', 'TypeScript', 'SQL', 'HTML/CSS', 'Go'],
    backend: ['ASP.NET Core', 'Entity Framework Core', 'PostgreSQL', 'MediatR', 'Redis'],
    frontend: ['React', 'Vite', 'Tailwind CSS v4', 'TanStack Query', 'Zustand'],
    tools: ['Docker', 'Git', 'Visual Studio', 'VS Code', 'GitLab CI', 'GitHub Actions'],
  }

  const principles = [
    { title: 'Kesederhanaan (Simplicity)', desc: 'Menghindari overengineering. Mengimplementasikan solusi sederhana yang menyelesaikan masalah secara efektif sebelum mengenalkan kompleksitas.' },
    { title: 'Arsitektur Bersih (Clean Code)', desc: 'Menulis kode yang mudah dibaca dan dipelihara oleh orang lain. Dokumentasi, pemisahan tanggung jawab (separation of concerns), dan testing adalah pilar utamanya.' },
    { title: 'Konsistensi (Consistency)', desc: 'Mengikuti konvensi dan standar kode yang ada di dalam codebase agar timbal balik pengembangan berjalan lancar dan minim friksi.' },
  ]

  return (
    <div>
      <div className="flex flex-col gap-8 pb-10">
        <div className="flex justify-between items-baseline border-b border-ink/14 pb-4">
          <Headline size="lg" as="h1">Tentang Saya</Headline>
          <span className="font-mono text-xs text-ink-muted">EDITORIAL BIO</span>
        </div>

        <div className="grid grid-cols-[1.5fr_1px_1fr] gap-x-10 max-sm:grid-cols-1 max-sm:[&>[role=separator]]:hidden">
          {/* Biography */}
          <article className="flex flex-col gap-4">
            <Headline size="md" as="h2">Gani — Software Engineer & Builder</Headline>
            <p className="font-sans text-base leading-relaxed text-ink-body">
              Saya adalah seorang backend-focused software engineer yang gemar membangun aplikasi web handal, scalable, dan bersih. Fokus saya mencakup pengembangan RESTful API menggunakan .NET Core, clean architecture, desain database, dan automasi deployment.
            </p>
            <p className="font-sans text-base leading-relaxed text-ink-body">
              Melalui **GanihuhStack**, saya membuat wadah eksplorasi teknologi pribadi di mana saya membagikan jurnal kerja, tulisan teknis mengenai arsitektur perangkat lunak, proyek-proyek open-source, dan hal-hal yang saya pelajari dalam pekerjaan sehari-hari.
            </p>
            <p className="font-sans text-base leading-relaxed text-ink-body">
              Saya percaya bahwa membangun sistem yang baik memerlukan ketekunan dan perhatian terhadap detail terkecil. Bagi saya, keindahan perangkat lunak tidak hanya terlihat pada performa aplikasinya di layar pengguna, melainkan dari kerapian kodenya di balik layar.
            </p>
          </article>

          <Divider orientation="v" />

          {/* Tools & Tech Stack */}
          <div className="flex flex-col gap-6">
            <section className="bg-surface-sunken p-5 rounded-[4px] flex flex-col gap-4">
              <SectionHeading>Daily Tech Stack</SectionHeading>
              
              <div className="flex flex-col gap-3 mt-1">
                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Languages</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {stacks.languages.map(s => <Tag key={s} className="text-[10px] px-1.5 py-0.5">{s}</Tag>)}
                  </div>
                </div>

                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Backend & DB</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {stacks.backend.map(s => <Tag key={s} className="text-[10px] px-1.5 py-0.5">{s}</Tag>)}
                  </div>
                </div>

                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Frontend</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {stacks.frontend.map(s => <Tag key={s} className="text-[10px] px-1.5 py-0.5">{s}</Tag>)}
                  </div>
                </div>

                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Tools</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {stacks.tools.map(s => <Tag key={s} className="text-[10px] px-1.5 py-0.5">{s}</Tag>)}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <Divider />

        {/* Programming Principles */}
        <section className="flex flex-col gap-6 mt-2">
          <SectionHeading>Prinsip & Nilai Kerja</SectionHeading>
          <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
            {principles.map((p, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h3 className="font-serif text-[18px] font-bold text-ink leading-snug">
                  {idx + 1}. {p.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-ink-body">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
