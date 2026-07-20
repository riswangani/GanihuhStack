import Headline from '@/components/content/Headline'
import Divider from '@/components/core/Divider'

export default function ResumePage() {
  const experiences = [
    { role: 'Backend Engineer', company: 'Tech Corp', period: '2022 - Present', desc: 'Membangun microservices API berbasis C# .NET, mengoptimalkan query PostgreSQL, dan merancang infrastruktur cloud menggunakan Docker.' },
    { role: 'Full Stack Developer', company: 'Digital Agency', period: '2020 - 2022', desc: 'Mengembangkan aplikasi client-facing menggunakan React dan Node.js, mengelola server virtual (VPS), serta menerapkan CI/CD pipeline sederhana.' },
  ]

  const projects = [
    { name: 'GanihuhStack', role: 'Creator', desc: 'Full-stack blog and portfolio portal built with ASP.NET Core Clean Architecture, MediatR, and React.' },
    { name: 'Identity Provider', role: 'Contributor', desc: 'Custom auth service with token rotation, PKCE, and authorization policies.' },
  ]

  const education = [
    { degree: 'Sarjana Komputer (S.Kom.)', school: 'Universitas Teknologi', period: '2016 - 2020', desc: 'Jurusan Teknik Informatika. Berfokus pada Rekayasa Perangkat Lunak dan Jaringan.' },
  ]

  return (
    <div>
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex justify-between items-baseline border-b border-ink/14 pb-4">
          <Headline size="lg" as="h1">Resume / CV</Headline>
          <span className="font-mono text-xs text-ink-muted">GANI'S CURRICULUM VITAE</span>
        </div>

        <div className="grid grid-cols-[1fr_1px_1fr] gap-10 max-sm:grid-cols-1 max-sm:[&>[role=separator]]:hidden">
          {/* Left Column: Experience & Education */}
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-5">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-ink-muted">
                Work Experience
              </h2>
              <div className="flex flex-col gap-6">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif text-[18px] font-semibold text-ink m-0">{exp.role}</h3>
                      <span className="font-mono text-[11px] text-ink-muted">{exp.period}</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-ink-muted">{exp.company}</span>
                    <p className="font-sans text-sm leading-relaxed text-ink-body mt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-5">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-ink-muted">
                Education
              </h2>
              <div className="flex flex-col gap-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif text-[18px] font-semibold text-ink m-0">{edu.degree}</h3>
                      <span className="font-mono text-[11px] text-ink-muted">{edu.period}</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-ink-muted">{edu.school}</span>
                    <p className="font-sans text-sm leading-relaxed text-ink-body mt-1">{edu.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <Divider orientation="v" />

          {/* Right Column: Projects & Contact Info */}
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-5">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-ink-muted">
                Side Projects
              </h2>
              <div className="flex flex-col gap-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <h3 className="font-serif text-[18px] font-semibold text-ink m-0">{proj.name}</h3>
                    <span className="font-sans text-xs font-medium text-ink-muted">{proj.role}</span>
                    <p className="font-sans text-sm leading-relaxed text-ink-body mt-1">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-5 bg-surface-sunken p-5 rounded-[4px]">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-ink-muted mb-2">
                Let's Connect
              </h2>
              <ul className="font-sans text-sm text-ink-body flex flex-col gap-2.5 p-0 list-none m-0">
                <li>
                  <strong className="text-ink">Email:</strong> <a href="mailto:gani@example.com" className="underline hover:text-ink">gani@example.com</a>
                </li>
                <li>
                  <strong className="text-ink">GitHub:</strong> <a href="https://github.com/riswangani" target="_blank" rel="noreferrer" className="underline hover:text-ink">github.com/riswangani</a>
                </li>
                <li>
                  <strong className="text-ink">LinkedIn:</strong> <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">linkedin.com/in/riswangani</a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
