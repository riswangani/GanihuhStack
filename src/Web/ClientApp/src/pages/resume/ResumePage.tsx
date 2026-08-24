import React from 'react'
import { SectionHeading, Divider } from '@/shared/ui'
import { ResumeHeader, WorkExperienceSection, TechnicalSkillsSection, RowItem } from '@/features/resume'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading>{title}</SectionHeading>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}

const CONTACTS = [
  { label: 'Email', handle: 'riswangani11@gmail.com', href: 'mailto:riswangani11@gmail.com' },
  { label: 'Location', handle: 'DKI Jakarta, Indonesia', href: '#' },
  { label: 'GitHub', handle: 'github.com/riswangani', href: 'https://github.com/riswangani' },
  { label: 'LinkedIn', handle: 'linkedin.com/in/riswangp', href: 'https://linkedin.com/in/riswangp' },
]

export default function ResumePage() {
  return (
    <div className="max-w-[680px] mx-auto pt-4 pb-16">
      <ResumeHeader />

      {/* Content Sections */}
      <div className="flex flex-col gap-10">
        <Section title="Summary">
          <p className="font-sans text-sm leading-[1.8] text-ink-body m-0 text-justify">
            A <strong>Full-Stack Software Engineer</strong> specializing in the Financial Services domain. Guided by the philosophy that software engineering is not just about making code run, but about designing for <strong>long-term maintainability, observability, robust testing, and scalability</strong>. Proven expertise in implementing <strong>Clean Architecture</strong>, <strong>Domain-Driven Design (DDD)</strong>, and <strong>CQRS</strong> to translate complex business requirements into high-performance systems. Well-versed across the stack—from building secure minimal REST APIs with ASP.NET Core (.NET 8, 9, 10), EF Core, and Dapper, to crafting modern frontend interfaces in React, Svelte, and Vue, while actively applying <strong>CI/CD, containerization (Docker/Kubernetes)</strong>, and learning <strong>Event Sourcing</strong> for event-driven architectures.
          </p>
        </Section>

        <Divider />

        <Section title="Work Experience">
          <WorkExperienceSection />
        </Section>

        <Divider />

        <Section title="Technical Skills">
          <TechnicalSkillsSection />
        </Section>

        <Divider />

        <Section title="Side Projects">
          <RowItem date="2026 — Present" title="GanihuhStack" meta="Full-Stack Web & DevOps Lab" href="https://github.com/riswangani/GanihuhStack">
            <p className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 text-justify">
              A production-grade personal portfolio, technical journal blog, and software engineering laboratory. Built using .NET 10 (ASP.NET Core API), Clean Architecture, CQRS (MediatR), PostgreSQL, and React 19 + TypeScript. Orchestrated via **.NET Aspire** for local development, containerized with multi-stage Dockerfiles, configured for Kubernetes via **Aspirate**, and integrating **Object Storage (MinIO/AWS S3)** for decentralized media asset management.
            </p>
          </RowItem>
          <RowItem date="2025" title="Stack Auth" meta="Self-Hosted Authentication Module" href="#">
            <p className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 text-justify">
              A self-hosted authentication module utilizing JWT and secure cookie sessions, featuring multi-tenant support and encrypted refresh token rotation.
            </p>
          </RowItem>
        </Section>

        <Divider />

        <Section title="Education">
          <RowItem date="Feb 2025" title="Indonesia Computer University" meta="Bandung, ID">
            <div className="font-sans text-xs text-ink-muted leading-relaxed mt-0.5">
              <div>Major in Computer Science</div>
              <div>Cumulative GPA: 3.5/4.0 · Jabar Future Leaders Scholarship (JFLS) 2021</div>
              <div>Relevant Coursework: Algorithms; Data Structures; Software Engineering; Object-Oriented Programming; Database;</div>
            </div>
          </RowItem>
        </Section>

        <Divider />

        <Section title="Certifications & Training">
          <div className="flex flex-col gap-2 font-sans text-xs text-ink-muted">
            <div>• Frontend Web Developer Expert (Dicoding)</div>
            <div>• React - The Complete Guide (incl. Hooks, React Router, Redux)</div>
            <div>• Cloud Practitioner Essentials (Belajar dasar AWS Cloud)</div>
            <div>• Belajar Membuat Aplikasi Back-End untuk Pemula (Dicoding)</div>
            <div>• React Native Bootcamp (Binar Academy)</div>
            <div>• Fresh Graduate Academy Digital Talent Scholarship 2022: Big Data using Python (Cisco Networking Academy)</div>
          </div>
        </Section>

        <Divider />

        <Section title="Contact">
          <div className="flex flex-col">
            {CONTACTS.map((c, i) => (
              <React.Fragment key={i}>
                <div className="grid grid-cols-[130px_1fr] max-sm:grid-cols-1 gap-4 sm:gap-6 py-2.5 items-baseline">
                  <span className="font-sans text-sm text-ink-muted">{c.label}</span>
                  {c.href !== '#' ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans text-sm text-ink hover:text-ink-muted no-underline border-b border-transparent hover:border-ink transition-colors w-fit"
                    >
                      {c.handle} ↗
                    </a>
                  ) : (
                    <span className="font-sans text-sm text-ink">{c.handle}</span>
                  )}
                </div>
                {i < CONTACTS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
