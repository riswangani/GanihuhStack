import riswanImg from '@/assets/riswan.png'

export default function ResumeHeader() {
  return (
    <header className="flex gap-4 items-start mb-[48px]">
      <img
        src={riswanImg}
        alt="Riswan Gani Padilah"
        className="w-14 h-14 rounded-full object-cover shrink-0 border border-ink/10"
      />
      <div className="flex flex-col gap-1">
        <h1 className="font-sans font-medium text-[20px] text-ink m-0 leading-tight">Riswan Gani Padilah</h1>
        <p className="font-sans text-sm text-ink-muted m-0">Software Engineer</p>
        <a
          href="https://ganihuhstack.dev"
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 w-fit font-sans text-xs text-ink-muted bg-surface-sunken rounded-full px-3 py-1 no-underline hover:text-ink transition-colors"
        >
          ganihuhstack.dev
        </a>
      </div>
    </header>
  )
}
