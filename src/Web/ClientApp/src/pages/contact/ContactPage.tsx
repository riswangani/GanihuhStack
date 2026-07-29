import { useState } from 'react'
import { Headline, SectionHeading, Divider } from '@/shared/ui'

const inputCls = 'w-full font-sans text-sm text-ink bg-surface border border-ink/20 rounded-[2px] px-3 py-2 focus:outline-none focus:border-ink placeholder:text-ink-faint'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // For MVP, just show success since there is no backend contact form handler planned for MVP phase
    setSubmitted(true)
  }

  return (
    <div>
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex justify-between items-baseline border-b border-ink/14 pb-4">
          <Headline size="lg" as="h1">Kontak</Headline>
          <span className="font-mono text-xs text-ink-muted">GET IN TOUCH</span>
        </div>

        <div className="grid grid-cols-[1.4fr_1px_1fr] gap-10 max-sm:grid-cols-1 max-sm:[&>[role=separator]]:hidden">
          {/* Left Column: Form */}
          <div>
            <Headline size="md" className="mb-4">Kirim Pesan</Headline>
            {submitted ? (
              <div className="bg-surface p-6 border border-ink/14 rounded-[2px]">
                <p className="font-serif text-[18px] text-ink font-semibold mb-2">Terima kasih atas pesan Anda!</p>
                <p className="font-sans text-sm text-ink-body">Pesan Anda berhasil dikirim secara lokal. Saya akan segera menghubungi Anda kembali.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold tracking-wider text-ink-muted uppercase">Nama</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="Nama Anda" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold tracking-wider text-ink-muted uppercase">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="Alamat Email Anda" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold tracking-wider text-ink-muted uppercase">Pesan</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={6} className={inputCls} placeholder="Tulis pesan Anda di sini..." />
                </div>
                <button type="submit" className="font-sans text-[12px] font-semibold tracking-wider uppercase bg-ink text-paper px-6 py-2.5 rounded-[2px] self-start hover:opacity-85 transition-opacity mt-2">
                  Kirim Pesan →
                </button>
              </form>
            )}
          </div>

          <Divider orientation="v" />

          {/* Right Column: General Info */}
          <div className="flex flex-col gap-6">
            <Headline size="md" className="mb-2">Info Kontak</Headline>
            <p className="font-sans text-base leading-relaxed text-ink-body">
              Apakah Anda memiliki pertanyaan mengenai tulisan saya, kolaborasi proyek, atau ingin sekadar berdiskusi mengenai arsitektur perangkat lunak? Silakan kirim pesan atau hubungi saya langsung di media sosial berikut.
            </p>
            
            <section className="bg-surface-sunken p-5 rounded-[4px]">
              <SectionHeading className="mb-3">Social Media</SectionHeading>
              <ul className="font-sans text-sm text-ink-body flex flex-col gap-3 p-0 list-none m-0">
                <li>
                  <strong className="text-ink">GitHub:</strong> <a href="https://github.com/riswangani" target="_blank" rel="noreferrer" className="underline hover:text-ink">github.com/riswangani</a>
                </li>
                <li>
                  <strong className="text-ink">LinkedIn:</strong> <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">linkedin.com/in/riswangani</a>
                </li>
                <li>
                  <strong className="text-ink">Twitter / X:</strong> <a href="https://x.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">@riswangani</a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
